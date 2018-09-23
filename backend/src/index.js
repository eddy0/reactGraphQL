const log = console.log.bind(console)
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
require('dotenv').config({path: 'variables.env'})
const createServer = require('./createServer')
const db = require('./db')
const server = createServer()
const express = server.express

express.use(cookieParser())

express.use((req, res, next) => {
    const {token} = req.cookies
    if (token) {
        const {userId} = jwt.verify(token, process.env.APP_SECRET)
        if (userId) {
            req.userId = userId
        }
    }
    next()
})


express.use( async (req, res, next) => {
    if (!req.userId) {
        next()
    }
    const user = await db.query.user({where: {id: req.userId}}, `{id, permissions, email, name}`)
    if (user) {
        req.user = user
    }
    next()
})


server.start({
    cors: {
        credentials: true,
        origin: process.env.FRONTEND_URL,
    }
}, address => {
    log(`server is running on port http://localhost:${address.port}`)
})