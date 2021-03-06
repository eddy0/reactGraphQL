const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const stripe = require('../stripe')
const {hasPermission} = require('../utils')

const Mutations = {
    //c
    async createItem(parent, args, ctx, info) {
        if (!ctx.request.userId) {
            throw new Error('you have to login to do')
        }
        const item = await ctx.db.mutation.createItem({
            data: {
                user: {
                    connect: {
                        id: ctx.request.userId,
                    },
                },
                ...args,
            },
        }, info)
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
            }, `{id, title, user{id}}`,)
        const ownItem = item.user.id === ctx.request.userId
        const allowed = ctx.request.user.permissions.some((permission) => ['ADMIN', 'ITEMDELETE'].includes(permission))
        if (!ownItem && !allowed) {
            throw new Error(`you are not allowed`)
        }
        
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
        const {transport, emailTemplate} = require('../mail')
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
                }, info)
                const options = emailTemplate({email: user.email, token: resetToken})
                const mail = transport.sendMail(options)
                res('you have sent the reset request')
            })
        }).then(data => {
            return {message: data}
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
        }, info)
        const token = jwt.sign({userId: updatedUser.id}, process.env.APP_SECRET)
        ctx.response.cookie('token', token, {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24 * 365,
        })
        return updatedUser
    },
    
    async updatePermissions(parent, args, ctx, info) {
        if (!ctx.request.userId) {
            throw new Error(`please log in`)
        }
        const currentUser = await ctx.db.query.user({
            where: {
                id: ctx.request.userId,
            },
        }, info)
        
        hasPermission(currentUser, ['ADMIN', 'PERMISSIONUPDATE'])
        await ctx.db.mutation.updateUser({
            data: {
                permissions: {
                    set: args.permissions,
                },
            },
            where: {id: args.userId},
        }, info)
        return currentUser
    },
    
    async addToCart(parent, args, ctx, info) {
        const {userId} = ctx.request
        if (!userId) {
            throw new Error(`please log in`)
        }
    
        const existingCartItem = await ctx.db.query.cartItems({
            where: {
                user: {id: userId},
                item: {id: args.id}
                },
        }, info)
    
        if (existingCartItem && existingCartItem.length > 0) {
            return ctx.db.mutation.updateCartItem({
                where: {id: existingCartItem[0].id},
                data: {quantity: existingCartItem[0].quantity + 1}
            })
        }
        return ctx.db.mutation.createCartItem({
            data: {
                user: {
                    connect: { id: userId}
                },
                item: {
                    connect: { id: args.id}
                },
            }, 
        }, info)
    },
    
    async removeFromCart(parent, args, ctx, info) {
        const cartItem = await ctx.db.query.cartItem({
            where: {
                id: args.id
            }
        }, `{id, user{id}}`)
        if (!cartItem) {
            throw new Error(`no cart item found`)
        }
        if (cartItem.user.id !== ctx.request.userId) {
            throw new Error(`no user id`)
        }
        return ctx.db.mutation.deleteCartItem({
            where: {
                id: args.id
            }
        }, info)
    },
    
    async createOrder(parent, args, ctx, info)   {
        const {userId} = ctx.request
        if (!userId) {
            throw new Error(`please log in`)
        }
        const user = await ctx.db.query.user({where: {id: userId}}, `{id, name, email, cart{id, quantity, item{title, price, id, description, image, largeImage}} }`)
        const amount = user.cart.reduce((total, cart) => {
            return total + cart.item.price * cart.quantity
        }, 0)
        console.log('amount', amount)
        const charge = await stripe.charges.create({
            amount,
            currency: 'USD',
            source: args.token,
        })
        
        const orderItems = user.cart.map((cartItem) => {
            const orderItem = {
                ...cartItem.item,
                quantity: cartItem.quantity,
                user: {connect: {id: userId}}
            }
            delete orderItem.id
            return orderItem
        })
        
        const order = await ctx.db.mutation.createOrder({
            data: {
                total: charge.amount,
                charge: charge.id,
                items: {create: orderItems},
                user: {connect: {id: userId}}
            }
        })
        
        const cartItemIds = user.cart.map((cartItem) => cartItem.id)
        
        await ctx.db.mutation.deleteManyCartItems({where: {id_in: cartItemIds}})
        
        return order
    }
    
}

module.exports = Mutations
