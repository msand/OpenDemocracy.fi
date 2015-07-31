Votes = new Mongo.Collection("votes");
CurrentVotes = new Mongo.Collection("currentvotes");

Votes.allow({
    insert: function (userId, vote) {
        return vote.userId === userId;
    },
    update: function (userId, vote, fields, modifier) {
        return false;
    },
    remove: function (userId, vote) {
        return false;
    }
});

CurrentVotes.allow({
    insert: function (userId, vote) {
        return vote.userId === userId;
    },
    update: function (userId, vote, fields, modifier) {
        return vote.userId === userId;
    },
    remove: function (userId, vote) {
        return false;
    }
});
