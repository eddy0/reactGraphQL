const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')

const Mutations = {
    //c
    async createItem(parent, args, ctx, info) {
        const item = await ctx.db.mutation.createItem({
            data: {
                ...args,
            },
        }, info)
        console.log('item', item)
        
        return item
    },
    // u
    updateItem(parent, args, ctx, info) {
        const {id, ...rest} = args
        
        return ctx.db.mutation.updateItem({
            data: {...rest},
            where: {
                id: id,
            },
        }, info)
    },
    
    async deleteItem(parent, args, ctx, info) {
        const {id} = args
        const item = await ctx.db.query.item({
                where: {id: id},
            }, `{
                id
                title
            }`,
        )
        
        // todo check permision
        
        return ctx.db.mutation.deleteItem({
            where: {
                id: id,
            },
        }, info)
    },
    
    // user
    async signup(parent, args, ctx, info) {
        args.email = args.email.toLowerCase()
        let password = await bcrypt.hash(args.password, 10)
        const user = await ctx.db.mutation.createUser({
            data: {
                ...args,
                password,
                permissions: {set: ['USER']},
            },
        }, info)
        const token = jwt.sign({userId: user.id}, process.env.APP_SECRET)
        ctx.response.cookie('token', token, {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24 * 365,
        })
        return user
    },
    
    async signin(parent, args, ctx, info) {
        args.email = args.email.toLowerCase()
        const user = await ctx.db.query.user({
            where: {
                'email': args.email,
            },
        })
        if (!user) {
            throw new Error(`no such user found for Email ${args.email}`)
        }
        const valid = await bcrypt.compare(args.password, user.password)
        if (!valid) {
            throw new Error(`invalid password`)
        }
        const token = jwt.sign({userId: user.id}, process.env.APP_SECRET)
        
        ctx.response.cookie('token', token, {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24 * 365,
        })
        return user
    },
    
    signout(parent, args, ctx, info) {
        ctx.response.clearCookie('token')
        return {
            message: 'signed out',
        }
    },
    
    async requestReset(parent, args, ctx, info) {
        const { transport, emailTemplate } = require('../mail')
        const user = await ctx.db.query.user({where: {email: args.email}})
        if (!user) {
            throw new Error(`no such user found for Email`)
        }
        return new Promise((res, rej) => {
            crypto.randomBytes(20, (err, buf) => {
                if (err) {
                    rej(err)
                }
                const resetToken = buf.toString('hex')
                const resetTokenExpiry = Date.now() + 3600000
                console.log('resetToken', resetToken)
        
                ctx.db.mutation.updateUser({
                    where: {email: args.email},
                    data: {
                        resetToken,
                        resetTokenExpiry,
                    },
                })
                const options = emailTemplate({email: user.email, token: resetToken})
                const mail = transport.sendMail(options)
                res('you have sent the reset request')
            })
        }).then(data => {
            return {message: data }
        })
    },
    
    async resetPassword(parent, args, ctx, info) {
        if (args.password !== args.confirmPassword) {
            throw new Error(`Password doesn't match`)
        }
        const [user] = await ctx.db.query.users({
            where: {
                resetToken: args.resetToken,
                resetTokenExpiry_gte: Date.now() - 3600000,
            },
        })
        if (!user) {
            throw new Error(`token expired`)
        }
        const password = await bcrypt.hash(args.password, 10)
        const updatedUser = await ctx.db.mutation.updateUser({
            where: {email: user.email},
            data: {
                password,
                resetToken: null,
                resetTokenExpiry: null,
            },
        })
        const token = jwt.sign({userId: updatedUser.id}, process.env.APP_SECRET)
        ctx.response.cookie('token', token, {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24 * 365,
        })
        return updatedUser
    },
    
}

module.exports = Mutations
