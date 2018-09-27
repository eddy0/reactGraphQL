const {forwardTo} = require('prisma-binding')
const {hasPermission} = require('../utils')

const confirmedLogin = (ctx) => {
    const {userId} = ctx.request
    
    if (!userId) {
        throw new Error('you need to login in ')
    }
    return userId
}

const Query = {
    items: forwardTo('db'),
    item: forwardTo('db'),
    itemsConnection: forwardTo('db'),
    me(parent, args, ctx, info) {
        const {userId} = ctx.request
        if (!userId) {
            return null
        }
        return ctx.db.query.user({
            where: {
                id: userId
            }
        }, info)
    },
    users(parent, args, ctx, info) {
        const {userId} = ctx.request
        if (!userId) {
            throw new Error('you need to login in ')
        }
        hasPermission(ctx.request.user, ['ADMIN', 'PERMISSIONUPDATE'])
        return ctx.db.query.users({}, info)
    },
    
    async order(parent, args, ctx, info) {
        const userId = confirmedLogin(ctx)
        const order = await ctx.db.query.order({
            where: {id: args.id}
        }, info)
        const ownOrder = order.user.id === userId
        const isAdmin = ctx.request.user.permissions.includes('ADMIN')
        if ( !ownOrder && !isAdmin) {
            throw new Error('you are not authed to check this page ')
        }
        return order
    },
    async orders(parent, args, ctx, info) {
        const userId = confirmedLogin(ctx)
        return  await ctx.db.query.orders({
            where: {user: {id: userId}}
        }, info)
    },
    // async items(parent, args, ctx, info) {
    //     const items = await ctx.db.query.items()
    //     return items
    // }
};

module.exports = Query;
