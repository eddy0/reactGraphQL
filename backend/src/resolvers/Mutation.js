const Mutations = {
    async createItem(parent, args, ctx, info) {
        const item = await ctx.db.mutation.createItem({
            data: {
                ...args
            }
        }, info)
        console.log('item', item)
    
        return item
    }
}

module.exports = Mutations
