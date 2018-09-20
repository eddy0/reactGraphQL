const log = console.log.bind(console)
require('dotenv').config({path: 'variables.env'})
const createServer = require('./createServer')
const db = require('./db')
const server = createServer()

server.start({
    cors: {
        credentials: true,
        origin: process.env.FRONTEND_URL,
    }
}, address => {
    log(`server is running on port http://localhost:${address.port}`)
})