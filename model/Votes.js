Votes = new Mongo.Collection("votes");

Votes.allow({
    insert: function (userId, vote) {
        return true;
    },
    update: function (userId, vote, fields, modifier) {
        return userId && vote.userid === userId;
    },
    remove: function (userId, vote) {
        return userId && vote.userid === userId;
    }
});
