Propositions = new Mongo.Collection("propositions");

Propositions.allow({
    insert: function (userId, proposition) {
        return true;
    },
    update: function (userId, proposition, fields, modifier) {
        return userId && proposition.owner === userId;
    },
    remove: function (userId, proposition) {
        return userId && proposition.owner === userId;
    }
});
