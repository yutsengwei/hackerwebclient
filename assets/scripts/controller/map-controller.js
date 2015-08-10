(function() {
    angular.module('AngularMapModule')
        .controller('MapController', MapController);

    MapController.$injector = ['$scope', '$firebaseArray', '$firebaseObject', '$firebaseAuth']

    function MapController($scope, $firebaseArray, $firebaseObject, $firebaseAuth) {

        var vm = this;
        $scope.map = {
            center: {
                latitude: 24,
                longitude: 121
            },
            zoom: 7,
            bounds: {},
            scrollwheel: false
        };

        var createRandomMarker = function(i, bounds, idKey) {
            var lat_min = bounds.southwest.latitude,
                lat_range = bounds.northeast.latitude - lat_min,
                lng_min = bounds.southwest.longitude,
                lng_range = bounds.northeast.longitude - lng_min;

            if (idKey == null) {
                idKey = "id";
            }

            var latitude = lat_min + (Math.random() * lat_range);
            var longitude = lng_min + (Math.random() * lng_range);
            var ret = {
                latitude: latitude,
                longitude: longitude,
                title: 'm' + i,
                show:false,
                onMarkClick: function() {
                	ret.show = !ret.show;
                }
            };
            ret[idKey] = i;
            return ret;
        };
        $scope.randomMarkers = [];
        // Get the bounds from the map once it's loaded
        $scope.$watch(function() {
            return $scope.map.bounds;
        }, function(nv, ov) {
            // Only need to regenerate once
            if (!ov.southwest && nv.southwest) {
                var markers = [];
                for (var i = 0; i < 50; i++) {
                    markers.push(createRandomMarker(i, $scope.map.bounds))
                }
                $scope.randomMarkers = markers;
                // console.log($scope.randomMarkers)
            }
        }, true);

    }

})();