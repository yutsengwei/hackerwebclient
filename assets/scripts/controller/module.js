(function() {
    var app = angular.module('AngularMapModule', ['ui.router', 'uiGmapgoogle-maps', 'firebase']);

    app.config(uiRouteConfig);
    app.run(init);


    uiRouteConfig.$inject = ['$stateProvider', '$urlRouterProvider'];

    function uiRouteConfig($stateProvider, $urlRouterProvider) {

        $stateProvider
            .state('map', {
                abstract: true,
                views: {
                    "content": {
                        templateUrl: "assets/templates/map-rightPanel-template.html",
                    },
                }

            })
            .state('map.chat', {
                templateUrl: "assets/templates/map-chatroom-template.html",
            })
            // .state('map.event', {
            //     templateUrl: "assets/templates/map-events-template.html",
            // })
    }


    init.$inject = ['$state'];

    function init($state) {
        
    }

})();