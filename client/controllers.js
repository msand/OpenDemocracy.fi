angular.module('resultsFilters', [])
    .filter('averagePerOption', function () {
        return function (results) {
            if (!results) return;
            var n = results.length;
            var sums = results.reduce(function (memo, result) {
                var votes = result.votes;
                for (var name in votes) {
                    if (votes.hasOwnProperty(name)) {
                        if (!isFinite(memo[name])) {
                            memo[name] = +votes[name] || 0;
                        } else {
                            memo[name] += +votes[name] || 0;
                        }
                    }
                }
                return memo;
            }, {});
            var avgs = {};
            for (var name in sums) {
                if (sums.hasOwnProperty(name)) {
                    avgs[name] = sums[name] / n;
                }
            }
            return avgs;
        }
    });
angular.module('starter.controllers', ['resultsFilters'])

    .controller('AppCtrl', ['$scope', '$ionicModal', '$timeout', function ($scope, $ionicModal, $timeout) {
        // Form data for the login modal
        $scope.loginData = {};

        // Create the login modal that we will use later
        $ionicModal.fromTemplateUrl('client/templates/login.ng.html', {
            scope: $scope
        }).then(function (modal) {
            $scope.modal = modal;
        });

        // Triggered in the login modal to close it
        $scope.closeLogin = function () {
            $scope.modal.hide();
        };

        // Open the login modal
        $scope.login = function () {
            $scope.modal.show();
        };

        // Perform the login action when the user submits the login form
        $scope.doLogin = function () {
            console.log('Doing login', $scope.loginData);

            // Simulate a login delay. Remove this and replace with your login
            // code if using a login system
            $timeout(function () {
                $scope.closeLogin();
            }, 1000);
        };
    }])

    .controller('PropositionsCtrl', ['$scope', '$meteor', function ($scope, $meteor) {
        var vm = this;
        vm.page = 1;
        vm.perPage = 5;
        vm.sort = {createdAt: -1};
        vm.orderProperty = '-1';
        $meteor.autorun($scope, function () {
            var perPage = parseInt($scope.getReactively('vm.perPage'));
            var query = {
                limit: perPage,
                skip: (parseInt($scope.getReactively('vm.page')) - 1) * perPage,
                sort: $scope.getReactively('vm.sort')
            };
            $meteor.subscribe('propositions', query, $scope.getReactively('vm.search')).then(function () {
                vm.propositions = $meteor.collection(function () {
                    return Propositions.find({}, {sort: $scope.getReactively('vm.sort')});
                });
                vm.propositionsCount = $meteor.object(Counts, 'numberOfPropositions', false);
            });
        });
        vm.pageChanged = function (newPage) {
            vm.page = newPage;
        };
        $scope.$watch('vm.orderProperty', function () {
            if (vm.orderProperty)
                vm.sort = {createdAt: parseInt(vm.orderProperty)};
        });
    }])

    .controller('PropositionCtrl', ['$scope', '$stateParams', '$meteor', '$state', function ($scope, $stateParams, $meteor, $state) {
        var vm = this;
        var propositionId = $stateParams.propositionId;
        $meteor.subscribe('propositions').then(function () {
            vm.proposition = $meteor.object(Propositions, propositionId, false);
            $meteor.subscribe('votes', propositionId).then(function () {
                vm.votes = $meteor.collection(function () {
                    return Votes.find({
                        propositionId: propositionId
                    }, {
                        sort: {createdAt: -1}
                    });
                });
                var options = vm.proposition.options;
                var vote = vm.votes && vm.votes[0];
                if (!vote || !options) {
                    return;
                }
                var votes = vote.votes;
                options.forEach(function (option) {
                    var name = option.name;
                    if (name in votes) {
                        option.value = votes[name];
                    }
                });
            });
        });
        $meteor.subscribe('currentvotes', propositionId).then(function () {
            vm.results = $meteor.collection(function () {
                return CurrentVotes.find({
                    propositionId: propositionId
                }, {fields: {votes: 1, propositionId: 1}});
            });
        });
        $meteor.call('totalUsersVoted', propositionId).then(
            function(data){
                vm.totalUsersVoted = data;
            }
        );
        $meteor.subscribe('currentvote', propositionId).then(function () {
            vm.currentVote = $meteor.collection(function () {
                return CurrentVotes.find({
                    propositionId: propositionId,
                    userId: Meteor.userId()
                });
            });
            vm.vote = function vote() {
                var votes = _.reduce(vm.proposition.options, function (memo, option) {
                    memo[option.name] = option.value;
                    return memo;
                }, {});
                var vote = {
                    propositionId: propositionId,
                    userId: Meteor.userId(),
                    createdAt: new Date(),
                    votes: votes
                };
                vm.votes.save(vote).then(function () {
                    if (vm.currentVote[0]) {
                        vm.currentVote[0].votes = votes;
                        vm.currentVote.save(vm.currentVote[0]);
                    } else {
                        vm.currentVote.save({
                            propositionId: propositionId,
                            userId: Meteor.userId(),
                            votes: votes
                        });
                    }
                });
            };
        });
    }])

    .controller('NewPropositionCtrl', ['$scope', '$stateParams', '$meteor', '$state', function ($scope, $stateParams, $meteor, $state) {
        $scope.proposition = {
            options: []
        };
        $scope.option = {};
        $scope.addOption = function addOption() {
            $scope.proposition.options.push($scope.option);
            $scope.option = {};
        };
        $scope.removeOption = function removeOption(option) {
            if (!option) {
                return;
            }
            var i = $scope.proposition.options.indexOf(option);
            if (i !== -1) {
                $scope.proposition.options.splice(i, 1);
            }
        };
        $scope.propositions = $meteor.collection(Propositions).subscribe('propositions');
        $scope.addProposition = function addProposition() {
            var proposition = $scope.proposition;
            proposition.ownerId = Meteor.userId();
            proposition.owner = Meteor.user();
            proposition.createdAt = new Date();
            $scope.propositions.save(proposition).then(function () {
                $state.go('app.propositions');
            });
            $scope.proposition = {
                options: []
            };
        };
    }]);



