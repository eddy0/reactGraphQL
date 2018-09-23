const {forwardTo} = require('prisma-binding')
const {hasPermission} = require('../utils')
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
    }
    // async items(parent, args, ctx, info) {
    //     const items = await ctx.db.query.items()
    //     return items
    // }
};

module.exports = Query;
