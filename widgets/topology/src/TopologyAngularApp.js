/**
 * Created by kinneretzin on 07/11/2016.
 */

// Define the angular application
angular
    .module('topologyApp', ['cfy.topology'])
    .controller('topologyController', ['$scope','DataProcessingService','$rootScope', function($scope,DataProcessingService,$rootScope) {

        function isNodesChanged(topologyNodes, newNodes) {

            // compare # of nodes
            if (topologyNodes.length !== newNodes.length) {
                return true;
            }

            // compare node names, and if in the same order
            for (var i = 0; i < topologyNodes.length; i++) {
                if (topologyNodes[i].templateData.name !== newNodes[i].name) {
                    return true;
                }
            }

            return false;
        }

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

                var updatedTopology = DataProcessingService.encodeTopologyFromRest(topologyData);

                // If there isnt any previous data set the data
                if (!$scope.topologyData.nodes || isNodesChanged($scope.topologyData.nodes, newData.data.plan.nodes)) {
                    $scope.topologyData = updatedTopology;
                } else {
                    // otherwise, just refresh topology
                    $rootScope.$broadcast('topology::refresh', updatedTopology);
                }
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

