Meteor.publish("votes", function (propositionId) {
    var query = {
        propositionId: propositionId,
        userId: this.userId
    };
    Counts.publish(this, 'numberOfVotes', Votes.find(query), { noReady: true });
    return Votes.find(query);
});