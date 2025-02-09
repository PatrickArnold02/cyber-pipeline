// Load Libraries
import express from 'express'
const router = express.Router()

// Load Models
//const User = require('../models/user')
import User from '../models/user.js'

// Configure Logging
// router.use(requestLogger)

/* GET home page. */
router.get('/', async function (req, res, next) {
  let data = {}
  if (req.session.user_id) {
    const user = await User.query().findById(req.session.user_id)

    if (!user) {
      req.session.destroy()
    } else {
      // check if admin
      const roles = await User.relatedQuery('roles')
        .for(req.session.user_id)
        .select('name')

      data = {
        id: req.session.user_id,
        eid: user.eid,
        name: user.name,
        admin: roles.some((r) => r.name === 'admin'),
      }
    }
  }
  res.render('index', { data: data })
})

export default router
//module.exports = router
