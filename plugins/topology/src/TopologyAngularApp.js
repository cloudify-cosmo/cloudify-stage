/**
 * Created by kinneretzin on 07/11/2016.
 */

// Define the angular application
angular
    .module('topologyApp', ['cfy.topology'])
    .controller('topologyController', ['$scope','DataProcessingService', function($scope,DataProcessingService) {

        $scope.topologyData = {
            scale: 0.75,
            offset: [0, 0]
        };
        $scope.topologyLoading = true;


        $scope.dataUpdated = (newData) => {
            if (newData && newData.data) {
                var topologyData = {
                    data: newData.data,
                    instances: newData.instances,
                    scale: 0.75,
                    offset: [0, 0]
                };
                $scope.topologyData = DataProcessingService.encodeTopologyFromRest(topologyData);
            } else {
                $scope.topologyData = {
                    scale: 0.75,
                    offset: [0, 0]
                };
            }
            $scope.topologyLoading = false;
            $scope.$apply();
        };

        $scope.setLoading = () => {
            $scope.topologyLoading = true;
            $scope.$apply();
        };

        $scope.$on('setLoading',()=>{
            $scope.setLoading();
        });

        $scope.$on('updateData',(event,newData)=>{
            $scope.dataUpdated(newData);
        });
    }]);

