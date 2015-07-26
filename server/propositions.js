Meteor.publish("propositions", function (options, searchString) {
    var query = {
        $or:[
            {$or:[
                {'private': false},
                {'private': {$exists: false}}
            ]},
            {$and:[
                {owner: this.userId},
                {owner: {$exists: true}}
            ]}
        ]};
    query = {};
    if (searchString) {
        query.name = { '$regex' : '.*' + searchString + '.*', '$options' : 'i' };
    }
    Counts.publish(this, 'numberOfPropositions', Propositions.find(query), { noReady: true });
    return Propositions.find(query, options);
});