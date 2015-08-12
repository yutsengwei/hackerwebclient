(function() {
    angular.module('AngularMapModule')
        .controller('MapController', MapController);


    MapController.$injector = ['$scope', 'uiGmapLogger', 'AddressLookupSvc']

    function MapController($scope, uiGmapLogger, AddressLookupSvc) {

        var vm = this;
        uiGmapLogger.currentLevel = uiGmapLogger.LEVELS.debug;

        $scope.typhoonPolylines = [];
        $scope.typhoonMarks = [];
        $scope.typhoonCircles = [];

        $scope.eventMarks = [];

        $scope.map = {
            center: {
                latitude: 24,
                longitude: 121
            },
            zoom: 7,
            bounds: {},
            scrollwheel: false
        };
        $scope.typhoonPolylines.push({
            id: 1,
            path: [{
                latitude: 24,
                longitude: 124
            }, {
                latitude: 23,
                longitude: 124
            }, {
                latitude: 22,
                longitude: 123
            }, {
                latitude: 22,
                longitude: 122
            }],
            stroke: {
                color: '#6060FB',
                weight: 3
            },
            editable: true,
            draggable: false,
            geodesic: false,
            clickable: false,
            visible: true,
            icons: [{
                icon: {
                    path: google.maps.SymbolPath.FORWARD_OPEN_ARROW
                },
                offset: '25px',
                repeat: '50px'
            }],
            // events:{
            //     click:function(Polyline,eventName,model,arguments) {
            //         // console.log(Polyline.getPath().getArray());
            //     }
            // }
        });
        $scope.typhoonCircles.push({
            id: 1,
            center: {
                latitude: 22,
                longitude: 122
            },
            radius: 100000,
            stroke: {
                color: '#08B21F',
                weight: 2,
                opacity: 1
            },
            fill: {
                color: '#08B21F',
                opacity: 0.5
            },
            geodesic: true, // optional: defaults to false
            draggable: true, // optional: defaults to false
            clickable: true, // optional: defaults to true
            editable: true, // optional: defaults to false
            visible: true, // optional: defaults to true
            control: {}
        });


        var markerObj = function(marker) {
            var _this = this;
            _this.id = marker.id;
            _this.coords = {
                latitude: marker.coords.latitude,
                longitude: marker.coords.longitude
            };
            _this.infor = {
                address: "",
            }
            _this.windowOptions = {
                visible: false,
            }
            _this.events = {
                click: function(mark, eventName, model, arguments) {
                    var lat = mark.getPosition().lat();
                    var lon = mark.getPosition().lng();
                    AddressLookupSvc.lookupByLatLng(lat, lon).then(function(address) {
                        _this.infor.address = address;
                    });
                    _this.windowOptions.visible = !_this.windowOptions.visible;
                }
            }

        };
        markerObj.prototype.options = {
            draggable: false
        };

        var mark1 = new markerObj({
            id: 0,
            coords: {
                latitude: 23.480296,
                longitude: 120.401303
            },
            infor: "test1",
        });

        var mark2 = new markerObj({
            id: 1,
            coords: {
                latitude: 23.606311,
                longitude: 120.900474
            },
            infor: "test2",
        });
        var mark3 = new markerObj({
            id: 2,
            coords: {
                latitude: 23.768425,
                longitude: 121.260121
            },
            infor: "test3",
        });
        $scope.eventMarks.push(mark1);

        $scope.eventMarks.push(mark2);

        $scope.eventMarks.push(mark3);

    }

})();

angular.module('AngularMapModule').factory('GeolocationSvc', [
    '$q', '$window',
    function($q, $window) {
        return function() {
            var deferred = $q.defer();

            if (!$window.navigator) {
                deferred.reject(new Error('Geolocation is not supported'));
            } else {
                $window.navigator.geolocation.getCurrentPosition(function(position) {
                    deferred.resolve({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    });
                }, deferred.reject);
            }

            return deferred.promise;
        };
    }
]);
// refrence from http://www.proccli.com/2014/10/geocoding-in-angularjs
angular.module('AngularMapModule').factory('AddressLookupSvc', [
    '$q', '$http', 'GeolocationSvc',
    function($q, $http, GeolocationSvc) {
        var MAPS_ENDPOINT = 'http://maps.google.com/maps/api/geocode/json?latlng={POSITION}&sensor=false';

        return {
            urlForLatLng: function(lat, lng) {
                return MAPS_ENDPOINT.replace('{POSITION}', lat + ',' + lng);
            },

            lookupByLatLng: function(lat, lng) {
                var deferred = $q.defer();
                var url = this.urlForLatLng(lat, lng);

                $http.get(url).success(function(response) {
                    var address = response.results[0].formatted_address;

                    deferred.resolve(address);
                }).error(deferred.reject);

                return deferred.promise;
            },

            lookup: function() {
                var deferred = $q.defer();
                var self = this;

                GeolocationSvc().then(function(position) {
                    deferred.resolve(self.lookupByLatLng(position.lat, position.lng));
                }, deferred.reject);

                return deferred.promise;
            }
        };
    }
]);