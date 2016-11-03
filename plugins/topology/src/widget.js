/**
 * Created by kinneretzin on 07/09/2016.
 */

class Topology extends React.Component {
    componentDidMount() {
        this.binder = {};
        var binder = this.binder;

        angular
            .module('topologyApp', ['cfy.topology'])
            .controller('topologyController', ['$scope','DataProcessingService', function($scope,DataProcessingService) {

                $scope.topologyData = {};
                $scope.topologyLoading = false;


                $scope.dataUpdated = (newData) => {
                    if (newData && newData.items && newData.items[0]) {
                        var topologyData = {
                            data: newData.items[0],
                            scale: 0.75,
                            offset: [0, 29]
                        };
                        $scope.topologyData = DataProcessingService.encodeTopologyFromRest(topologyData);
                        $scope.$apply();
                    }
                };
                binder.$scope = $scope;


            }]);

        angular.bootstrap(this.refs.topologyContainer, ['topologyApp']);
    }

    //_refreshData() {
    //    this.props.context.refresh();
    //}

    componentDidUpdate(prevProps, prevState) {
        if (this.props.data.blueprintId !== prevProps.data.blueprintId ||
            this.props.data.deploymentId !== prevProps.data.deploymentId
            ) {
            this.props.context.refresh();
        } else {
            this.binder.$scope.dataUpdated(this.props.data);
        }
    }
    render () {
        return (
                <div ref='topologyContainer' dangerouslySetInnerHTML={{__html: this.props.template }}></div>
            );

    }
}

Stage.addPlugin({
    id: 'topology',
    name: "topology",
    description: 'blah blah blah',
    initialWidth: 8,
    initialHeight: 4,
    color: "yellow",
    isReact: true,
    //init: function() {
    //    angular
    //        .module('topologyApp', ['cfy.topology'])
    //        .controller('topologyController', ['$scope','DataProcessingService', function($scope,DataProcessingService) {
    //
    //            var topologyData = {
    //                data: {"node_templates" : {}},
    //                layout: {"nodes": [], "connectors": []} ,
    //                hierarchy: {}
    //            };
    //
    //            $scope.topologyData = DataProcessingService.encodeTopology(topologyData);
    //            $scope.topologyLoading = false;
    //        }]);
    //},
    fetchData: function(plugin,context,pluginUtils) {
        var deploymentId = context.getValue('deploymentId');
        var blueprintId = context.getValue('blueprintId');

        if (!deploymentId && !blueprintId) {
            return Promise.resolve({});
        }

        if (deploymentId) {
            return Promise.resolve({});
        } else if (blueprintId) {
            return new Promise( (resolve,reject) => {
                pluginUtils.jQuery.get({
                    url: context.getManagerUrl() + '/api/v2.1/blueprints?id='+blueprintId,
                    dataType: 'json'
                })
                    .done((blueprint)=> {
                        resolve(blueprint)
                    })
                    .fail(reject)
            });
        }
    },
    render: function(widget,data,error,context,pluginUtils) {
        if (!widget.plugin.template) {
            return 'Topology: missing template';
        }

        var topologyTemplate = _.template(widget.plugin.template)();
        var deploymentId = context.getValue('deploymentId');
        var blueprintId = context.getValue('blueprintId');

        var formattedData = Object.assign({},data,{
            deploymentId,
            blueprintId
        });
        return <Topology template={topologyTemplate}
                         widget={widget} data={formattedData} context={context} utils={pluginUtils}/>;

    }


});