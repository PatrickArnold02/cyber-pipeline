#!/usr/bin/env node

/**
 * Module dependencies.
 */

//var app = require('../app')
//var debug = require('debug')('cyber-pipeline:server')
//var http = require('http')
// Common JS --> ES6 Modules
import app from '../app.js'
import debugModule from 'debug'
const debug = debugModule('cyber-pipeline:server')
import http from 'http'

/**
 * Get port from environment and store in Express.
 */

const port = normalizePort(process.env.PORT || '3000')
app.set('port', port)

// Get Logger
//const logger = require('../configs/logger')
// CJS --> ES6M
import logger from '../configs/logger.js'

/**
 * Create HTTP server.
 */

const server = http.createServer(app)

/**
 * Listen on provided port, on all network interfaces.
 */
server.on('error', onError)
server.on('listening', onListening)

// Migrate Database on Startup
//const db = require('../configs/db')
// CJS --> ES6
import db from '../configs/db.js'
db.migrate.currentVersion().then(function (version) {
  logger.info('Database Migration Version: ' + version)
  if (version == 'none') {
    logger.info('Database Empty - Migrating and Seeding')
    db.migrate
      .latest()
      .then(function () {
        return db.seed.run()
      })
      .then(function () {
        logger.info('Complete!')
        server.listen(port)
      })
  } else {
    logger.info('Database Exists - Migrating')
    db.migrate.latest().then(function () {
      logger.info('Complete!')
      server.listen(port)
    })
  }
})
/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  const port = parseInt(val, 10)

  if (isNaN(port)) {
    // named pipe
    return val
  }

  if (port >= 0) {
    // port number
    return port
  }

  return false
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error
  }

  const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges')
      process.exit(1)
      break
    case 'EADDRINUSE':
      console.error(bind + ' is already in use')
      process.exit(1)
      break
    default:
      throw error
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  const addr = server.address()
  const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port
  debug('Listening on ' + bind)
}