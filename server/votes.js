Meteor.publish("votes", function (propositionId) {
    var query = {
        propositionId: propositionId,
        userId: this.userId
    };
    Counts.publish(this, 'numberOfVotes', Votes.find(query), {noReady: true});
    return Votes.find(query);
});
Meteor.publish("currentvotes", function (propositionId) {
    Counts.publish(this, 'totalUsersVoted', CurrentVotes.find({
        propositionId: propositionId
    }), {noReady: true});

    return CurrentVotes.find({
        propositionId: propositionId
    }, {fields: {votes: 1}});
});