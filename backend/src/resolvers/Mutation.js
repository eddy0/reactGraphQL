const Mutations = {
    //c
    async createItem(parent, args, ctx, info) {
        const item = await ctx.db.mutation.createItem({
            data: {
                ...args
            }
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
               id: id
            }
        }, info)
    },
}

module.exports = Mutations
