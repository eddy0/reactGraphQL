const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

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
            httpOnly:true,
            maxAge: 1000 * 60 * 60 * 24 * 365,
        })
        return user
    },
    
    async signin(parent, args, ctx, info) {
        args.email = args.email.toLowerCase()
        const user = await ctx.db.query.user({
            where: {
                'email': args.email,
            }
        })
        if (!user) {
            throw new Error(`no such user found for Email ${args.email}`)
        }
        const valid = await bcrypt.compare(arg.password, user.password)
        if (!valid) {
            throw new Error(`invalid password`)
        }
        const token = jwt.sign({userId: user.id}, process.env.APP_SECRET)
        
        ctx.response.cookie('token', token, {
            httpOnly:true,
            maxAge: 1000 * 60 * 60 * 24 * 365,
        })
        return user
    },
    
}

module.exports = Mutations
