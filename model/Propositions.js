Propositions = new Mongo.Collection("propositions");

Propositions.allow({
    insert: function (userId, proposition) {
        return true;
    },
    update: function (userId, proposition, fields, modifier) {
        return false;
    },
    remove: function (userId, proposition) {
        return false;
    }
});
