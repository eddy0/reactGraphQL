const {forwardTo} = require('prisma-binding')

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
    }
    // async items(parent, args, ctx, info) {
    //     const items = await ctx.db.query.items()
    //     return items
    // }
};

module.exports = Query;
