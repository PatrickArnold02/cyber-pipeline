import request from 'supertest'
import app from '../app.js'
import { describe, it, beforeAll, expect } from 'vitest'
import 'dotenv/config'
import db from '../configs/db.js'
import jwt from 'jsonwebtoken'
import Ajv from 'ajv'

beforeAll(async () => {
  db.migrate.latest()
  db.seed.run()
})

const shouldAllowLogin = (user) => {
  it('should allow ' + user.eid + ' to log in and get token', async () => {
    const agent = request.agent(app)
    await agent.get('/auth/login?eid=' + encodeURIComponent(user.eid))
      const res = await agent
        .get('/auth/token')
        .expect(200)
          const token = res.body.token
          agent
            .get('/api/v1')
            .auth(token, { type: 'bearer' })
            .expect(200)
  })
}

const loginShouldRedirectToHomepage = (user) => {
  it('should redirect ' + user.eid + ' to homepage', async () => {
    const agent = request.agent(app)
    await agent
      .get('/auth/login?eid=' + encodeURIComponent(user.eid))
      .expect(302)
      .expect('Location', '/')
  })
}

const tokenShouldIncludeUserData = (user) => {
  it('should include user info in token', async () => {
    const agent = request.agent(app)
    await agent.get('/auth/login?eid=' + encodeURIComponent(user.eid))
    console.log("login successful")
      const res = await agent
        .get('/auth/token')
        .expect(200)
      console.log("got agent")
          const token = res.body.token
          const token_user = jwt.decode(token)
          console.log("decoded token")
          expect(token_user).property('user_id').eql(user.id)
          expect(token_user).property('eid').eql(user.eid)
          console.log("finished test")
  })
}

const tokenShouldBeValid = (user) => {
  it('should have a valid token signature', async () => {
    const agent = request.agent(app)
    await agent.get('/auth/login?eid=' + encodeURIComponent(user.eid))
      const res = await agent
        .get('/auth/token')
        .expect(200)
          const token = res.body.token
          try {
            const decoded = await new Promise((resolve, reject) => {
              jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
                if (err) return reject(err)
                  resolve(decoded)
            })
           
              expect(decoded).property('user_id').eql(user.id)
              expect(decoded).property('email').eql(user.email)
              expect(decoded).property('is_admin').eql(user.is_admin)
            })
          } catch (err) {
              throw err
          }
  })
}

const tokenSchemaShouldBeValid = (user) => {
  it('should have a valid token schema', async () => {
    const schema = {
      type: 'object',
      properties: {
        user_id: { type: 'number' },
        eid: { type: 'string' },
        roles: {
          type: 'array',
          items: { type: 'string' } 
        },
        refresh_token: { type: 'string' },
        iat: { type: 'number' },
        exp: { type: 'number' },
      },
      required: ['user_id', 'eid', 'roles', 'refresh_token', 'iat', 'exp'],  
      additionalProperties: false,  
    }
    const ajv = new Ajv()
    const validate = ajv.compile(schema)
    const agent = request.agent(app)
    await agent.get('/auth/login?eid=' + encodeURIComponent(user.eid))
       const res = await agent
        .get('/auth/token')
        .expect(200)
        const token = res.body.token
        const decoded = jwt.decode(token)
        const isValid = validate(decoded)
      expect(isValid).toBe(true)
  })
}

const loginShouldFailOnNoEmail = (user) => {
  it('should fail on bad email', async () => {
    const agent = request.agent(app)
    await agent.get('/auth/login?eid=' + encodeURIComponent(user.eid))
      agent
        .get('/auth/token')
        .expect(401)
  })
}

const tokenShouldFailOnNoSession = () => {
  it('should not issue token without session', async () => {
    const agent = request.agent(app)
    agent
      .get('/auth/token')
      .expect(401)
  })
}

const tokenShouldFailOnNoRole = (user) => {
  it('should not issue token without appropriate role', async () => {
    const agent = request.agent(app)
    agent.get('/auth/login?eid=' + encodeURIComponent(user.eid))
      agent.get('/auth/token').expect(401)
  })
}

const logoutShouldClearSession = (user) => {
  it('should clear session on logout', async () => {
    const agent = request.agent(app)
    await agent.get('/auth/login?eid=' + encodeURIComponent(user.eid))
      agent
        .get('/auth/token')
        .expect(200)
      agent
        .get('/auth/logout')
        .expect(302)
        .expect('Location', '/')
      agent
        .get('/auth/token')
        .expect(401)
  })
}


describe('/auth', () => {
  describe('user: test-admin', () => {
    const user = {
      id: 1,
      eid: "test-admin",
      is_admin: true,
    }

    shouldAllowLogin(user)
    tokenShouldIncludeUserData(user)
    tokenShouldBeValid(user)
    tokenSchemaShouldBeValid(user)
    loginShouldRedirectToHomepage(user)
    logoutShouldClearSession(user)
  })

  describe('user: test-api', () => {
    const user = {
      id: 3,
      eid: 'test-student',
      is_admin: false,
    }

    shouldAllowLogin(user)
    tokenShouldIncludeUserData(user)
    tokenShouldBeValid(user)
    tokenSchemaShouldBeValid(user)
    loginShouldRedirectToHomepage(user)
    logoutShouldClearSession(user)
  })

  describe('user: test-fail', () => {
    const user = {
      id: 0,
      eid: 'test',
      email: '',
      is_admin: false,
    }

    loginShouldFailOnNoEmail(user)
    tokenShouldFailOnNoSession()
  })

  describe('user: test-new', () => {
    const user = {
      id: 5,
      eid: 'anothertesteid',
      email: 'test-new@',
      is_admin: false,
    }

    loginShouldRedirectToHomepage(user)
    tokenShouldFailOnNoRole(user)
  })

  describe('user: test-student', () => {
    const user = {
      id: 2,
      eid: 'testeid',
      email: 'test-student@russfeld.me',
      is_admin: false,
    }

    loginShouldRedirectToHomepage(user)
    tokenShouldFailOnNoRole(user)
  })
})
