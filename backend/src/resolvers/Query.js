const Query = {
    dogs(parent, args, ctx, info) {
        return [{name: 'sinckers'}, {name: 'Sunny'}]
    }
};

module.exports = Query;
