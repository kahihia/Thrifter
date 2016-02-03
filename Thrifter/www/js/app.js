// Thrifter

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js

angular.module('thrifterApp', ['ionic', 'ngCordova', 'greatCircles', 'thrifterApp.controllers', 'thrifterApp.services', 'ionic.contrib.ui.tinderCards'])

    .directive('noScroll', function() {
        return {
            restrict: 'A',
            link: function($scope, $element, $attr) {
                $element.on('touchmove', function(e) {
                    e.preventDefault();
                });
            }
        }
    })

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  })
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

  .state('app', {
    url: "/app",
    abstract: true,
    templateUrl: "templates/menu.html",
       //   controller: 'AppCtrl'
  })

      .state('app.selling', {
        url: "/selling",
        views: {
          'menuContent': {
            templateUrl: "templates/selling.html"
          }
        }
      })

      .state('app.share', {
        url: "/share",
        views: {
          'menuContent': {
            templateUrl: "templates/share.html"
          }
        }
      })

      .state('app.preferences', {
        url: "/preferences",
        views: {
          'menuContent': {
            templateUrl: "templates/preferences.html"
          }
        }
      })

      .state('app.account', {
        url: "/account",
        views: {
          'menuContent': {
            templateUrl: "templates/account.html"
          }
        }
      })

      .state('app.help', {
        url: "/help",
        views: {
          'menuContent': {
            templateUrl: "templates/help.html"
          }
        }
      })

      .state('app.welcome', {
        url: "/welcome",
        views: {
          'menuContent': {
            templateUrl: "templates/welcome.html"
          }
        }
      })

      .state('app.add-listing', {
          url: "/add-listing",
          views: {
              'menuContent': {
                  templateUrl: "templates/add-listing.html",
                 // controller: 'ImageSubmissionCtrl'
              }
          }
      })

      .state('app.watching', {
          url: "/watching",
          views: {
              'menuContent': {
                  templateUrl: "templates/watching.html"
              }
          }
      })

      .state('app.browse', {
          url: "/browse",
          views: {
              'menuContent': {
                  templateUrl: "templates/browse.html",
              }
          }
      });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/browse');


});

