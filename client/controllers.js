angular.module('starter.controllers', [])

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
        vm.perPage = 3;
        vm.sort = { name: 1 };
        vm.orderProperty = '1';
        vm.propositions = $meteor.collection(function() {
            return Propositions.find({}, {
                sort : $scope.getReactively('vm.sort')
            });
        });
        $meteor.autorun($scope, function() {
            var perPage = parseInt($scope.getReactively('vm.perPage'));
            $meteor.subscribe('propositions', {
                limit: perPage,
                skip: (parseInt($scope.getReactively('vm.page')) - 1) * perPage,
                sort: $scope.getReactively('vm.sort')
            }, $scope.getReactively('vm.search')).then(function(){
                $scope.propositionsCount = $meteor.object(Counts ,'numberOfPropositions', false);
            });
        });
        $scope.pageChanged = function(newPage) {
            $scope.page = newPage;
        };
        $scope.$watch('orderProperty', function(){
            if ($scope.orderProperty)
                $scope.sort = {name: parseInt($scope.orderProperty)};
        });
    }])

    .controller('PropositionCtrl', ['$scope', '$stateParams', '$meteor', function ($scope, $stateParams, $meteor){
        $scope.proposition = $meteor.object(Propositions, $stateParams.propositionId).subscribe('propositions');
    }])

    .controller('NewPropositionCtrl', ['$scope', '$stateParams', '$meteor', '$state', function ($scope, $stateParams, $meteor, $state){
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
        $scope.propositions = $meteor.collection(Propositions);
        $scope.addProposition = function addProposition() {
            var proposition = $scope.proposition;
            proposition.ownerId = Meteor.userId();
            proposition.owner = Meteor.user();
            $scope.propositions.save(proposition);
            $scope.proposition = {
                options: []
            };

            $state.go('app.propositions');
        };
    }]);



