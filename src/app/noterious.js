'use strict';

angular.module('noterious', [ //main container is called "notorious" (top level container) | instantiated on the html tag (or body tag) | wherever the ng-app module is instantiated
  //do NOT put ng-App on the head tag

  //dependencies are listed here:
      // these modules are being chosen 'off the menu'
  'ui.router',
  'ngAnimate',
  'firebase',
  'noterious.common',
  'gridster'
])
  .constant('ENDPOINT_URI', 'https://noterious.firebaseio.com/')
  .config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/boards'); // if no match the state, redirect to default route here

    $stateProvider // all of the different routes:
      .state('login', {
        url:'/login',
        templateUrl: 'app/login/login.tmpl.html',
        controller: 'LoginCtrl',
        controllerAs: 'login' //shorthand rename of the controller?
      })
      .state('boards', {
        url:'/boards',
        templateUrl: 'app/boards/boards-mdv.tmpl.html',
        controller: 'BoardsCtrl',
        controllerAs: 'ctrl', //shorthand rename of the controller?

        //Data needs to be available for the route (authenticate on firebase before you go to the route):
        resolve: {
          'currentUser': ['Auth', function (Auth) {
            return Auth.$requireAuth();
          }]
        }
      })
      .state('notes', {
        url:'/boards/:boardId/notes',
        templateUrl: 'app/notes/notes-mdv.tmpl.html',
        controller: 'NotesCtrl',
        controllerAs: 'ctrl', //shorthand rename of the controller?

        //Data needs to be available for the route (authenticate on firebase before you go to the route):
        resolve: {
          'currentUser': ['Auth', function (Auth) {
            return Auth.$requireAuth();
          }]
        }
      })
    ;
  })
  .run(function ($rootScope, $state) {
    $rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {
      event.preventDefault();
      if (error === 'AUTH_REQUIRED') { //if something goes wrong, redirect to login
        $state.go('login');
      }
    });
  })
;
