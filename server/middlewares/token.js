// https://www.digitalocean.com/community/tutorials/nodejs-jwt-expressjs
import jwt from 'jsonwebtoken'
// Load Models
// const User = require('../models/user')

// Load Logger
import logger from '../configs/logger.js'

async function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (token == null) return res.sendStatus(401)

  jwt.verify(token, process.env.TOKEN_SECRET, async (err, user) => {
    // console.log(err)

    if (err) {
      if (err.name === 'TokenExpiredError') {
        return res.sendStatus(401)
      } else {
        logger.warn('API Token Parse Error - ' + err)
        return res.sendStatus(403)
      }
    }

    req.user_id = user.user_id
    req.user_eid = user.eid
    // HACK This trusts the JWT signature to give admin privs.
    // See below for a DB method for this - less efficient.
    req.roles = user.roles

    // // check if admin
    // const roles = await User.relatedQuery('roles')
    //   .for(req.user_id)
    //   .select('name')
    // //Roles for current user
    // //console.log(roles)
    if (user.roles.some((r) => r === 'admin')) {
       req.is_admin = true
       console.log("is_admin is true")
     } else {
       req.is_admin = false
     }

    next()
  })
}

export default authenticateToken
