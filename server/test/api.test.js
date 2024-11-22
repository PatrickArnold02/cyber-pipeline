import request from 'supertest'
import app from '../app.js'
import { describe, it, beforeAll, expect} from 'vitest'
import 'dotenv/config'
import Ajv from 'ajv'

const numUsers = 5

const login = async (adminUser) => {
  const agent = request.agent(app)
  return agent
    .get('/auth/login?eid=' + encodeURIComponent(adminUser.eid))
    .then(() => {
      return agent
        .get('/auth/token')
        .expect(200)
        .then((res) => {
          return res.body.token
        })
    })
  }

const apiShouldReturnUserDataWithAdmin = (user) => {
    it('should return data about current user', async () => {
      const res = await request(app)
        .get('/api/v1')
        .set('Authorization', `Bearer ${user.token}`)
        .expect(200)
          expect(res.body).property('user_id').eql(1)
          expect(res.body).property('version').eql(1.0)
          expect(res.body).property('is_admin').eql(1)
    })
  }
  
  const apiShouldReturnUserDataWithStudent = (user) => {
    it('should return data about current user', async () => {
      const res = await request(app)
        .get('/api/v1')
        .set('Authorization', `Bearer ${user.token}`)
        .expect(200)
          expect(res.body).property('user_id').eql(user.id)
          expect(res.body).property('version').eql(1.0)
          expect(res.body).property('is_admin').eql(0)
    })
  }

  const apiSchemaShouldBeValid = (user) => {
    it('should have a valid schema', async () => {
      const schema = {
        type: 'object',
        properties: {
          user_id: { type: 'number' },
          version: { type: 'number' },
          is_admin: { type: 'number', enum: [0, 1] },
        },
        required: ['user_id', 'version', 'is_admin'],
        additionalProperties: false,
      }
      const ajv = new Ajv()
      const validate = ajv.compile(schema)
      const res = await request(app)
        .get('/api/v1')
        .set('Authorization', `Bearer ${user.token}`)
        .expect(200)
        const isValid = validate(res.body)
        expect(isValid).toBe(true)
        })
  }
  
  describe('/api/v1/users', () => {
    describe('user: test-admin', () => {
    //Creates a mock user
    let adminUser = {
        eid:'test-admin',
        token: null,
    }
    beforeAll(async () => {
      adminUser.token = await login(adminUser)
    })
  
      apiShouldReturnUserDataWithAdmin(adminUser)
      apiSchemaShouldBeValid(adminUser)
    })
  
    describe('user: test-api', () => {
      let user = {
        eid: 'test-student',
        token: null,
        id: 3
      }
      beforeAll(async () => {
        user.token = await login(user)
      })
  
      apiShouldReturnUserDataWithStudent(user)
      apiSchemaShouldBeValid(user)
    })
  })