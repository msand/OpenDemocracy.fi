// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js

Meteor.startup(function () {
    angular.bootstrap(document, ['starter']);
});

angular.module('starter', ['angular-meteor', 'ionic', 'angularUtils.directives.dirPagination', 'starter.controllers'])

    .run(["$rootScope", "$state", '$ionicPlatform', function ($rootScope, $state, $ionicPlatform) {
        $rootScope.$on("$stateChangeError", function(event, toState, toParams, fromState, fromParams, error) {
            // We can catch the error thrown when the $requireUser promise is rejected
            // and redirect the user back to the main page
            if (error === "AUTH_REQUIRED") {
                $state.go('app.propositions');
            }
        });
        $ionicPlatform.ready(function () {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }
            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.styleDefault();
            }
        });
    }])

    .config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {

        $stateProvider

            .state('app', {
                url: "/app",
                abstract: true,
                templateUrl: 'client/templates/menu.ng.html',
                controller: 'AppCtrl'
            })

            .state('app.search', {
                url: "/search",
                views: {
                    'menuContent': {
                        templateUrl: 'client/templates/search.ng.html'
                    }
                }
            })

            .state('app.browse', {
                url: "/browse",
                views: {
                    'menuContent': {
                        templateUrl: 'client/templates/browse.ng.html'
                    }
                }
            })
            .state('app.propositions', {
                url: "/propositions",
                views: {
                    'menuContent': {
                        templateUrl: 'client/templates/propositions.ng.html',
                        controller: 'PropositionsCtrl as vm'
                    }
                }
            })

            .state('app.single', {
                url: "/propositions/:propositionId",
                views: {
                    'menuContent': {
                        templateUrl: 'client/templates/proposition.ng.html',
                        controller: 'PropositionCtrl as vm'
                    }
                }
            })

            .state('app.new', {
                url: "/proposition",
                views: {
                    'menuContent': {
                        templateUrl: 'client/templates/new-proposition.ng.html',
                        controller: 'NewPropositionCtrl'
                    }
                }
            });
        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/app/propositions');
    }]);

