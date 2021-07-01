// @ts-nocheck File not migrated fully to TS
/**
 * Created by jakubniezgoda on 03/01/2017.
 */

import { icons } from 'cloudify-ui-common';
import NodeInstancesTable from './NodeInstancesTable';
import NodeInstancePropType from './props/NodeInstancePropType';

export default class NodesTable extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            error: null
        };
    }

    componentDidMount() {
        const { toolbox } = this.props;
        toolbox.getEventBus().on('nodes:refresh', this.refreshData, this);
    }

    shouldComponentUpdate(nextProps, nextState) {
        const { data, widget } = this.props;
        return (
            !_.isEqual(widget, nextProps.widget) ||
            !_.isEqual(this.state, nextState) ||
            !_.isEqual(data, nextProps.data)
        );
    }

    componentWillUnmount() {
        const { toolbox } = this.props;
        toolbox.getEventBus().off('nodes:refresh', this.refreshData);
    }

    fetchGridData = fetchParams => {
        const { toolbox } = this.props;
        return toolbox.refresh(fetchParams);
    };

    refreshData() {
        const { toolbox } = this.props;
        toolbox.refresh();
    }

    selectNode(item) {
        const { toolbox } = this.props;
        const selectedDepNodeId = toolbox.getContext().getValue('depNodeId');
        const clickedDepNodeId = item.id + item.deployment_id;
        const clickedAlreadySelectedNode = clickedDepNodeId === selectedDepNodeId;
        toolbox.getContext().setValue('depNodeId', clickedAlreadySelectedNode ? null : clickedDepNodeId);
        toolbox.getContext().setValue('nodeId', clickedAlreadySelectedNode ? null : item.id);
        toolbox.getContext().setValue('nodeInstanceId', null);
        toolbox.getEventBus().trigger('topology:selectNode', clickedAlreadySelectedNode ? null : item.id);
    }

    render() {
        const { data, toolbox, widget } = this.props;
        const { error } = this.state;
        const NO_DATA_MESSAGE = "There are no Nodes available. Probably there's no deployment created, yet.";
        const { CopyToClipboardButton, DataTable, ErrorMessage, Icon, Popup } = Stage.Basic;

        const { fieldsToShow } = widget.configuration;

        return (
            <div>
                <ErrorMessage error={error} onDismiss={() => this.setState({ error: null })} autoHide />

                <DataTable
                    fetchData={this.fetchGridData}
                    totalSize={data.total}
                    pageSize={widget.configuration.pageSize}
                    sortColumn={widget.configuration.sortColumn}
                    sortAscending={widget.configuration.sortAscending}
                    searchable
                    selectable
                    className="nodesTable"
                    noDataMessage={NO_DATA_MESSAGE}
                >
                    <DataTable.Column width="5%" />
                    <DataTable.Column label="Name" name="id" width="15%" show={fieldsToShow.indexOf('Name') >= 0} />
                    <DataTable.Column label="Type" name="type" width="20%" show={fieldsToShow.indexOf('Type') >= 0} />
                    <DataTable.Column
                        label="Blueprint"
                        name="blueprint_id"
                        width="10%"
                        show={fieldsToShow.indexOf('Blueprint') >= 0 && !data.blueprintSelected}
                    />
                    <DataTable.Column
                        label="Deployment"
                        name="deployment_display_name"
                        width="10%"
                        show={fieldsToShow.indexOf('Deployment') >= 0 && !data.deploymentSelected}
                    />
                    <DataTable.Column
                        label="Deployment ID"
                        name="deployment_id"
                        width="10%"
                        show={fieldsToShow.indexOf('Deployment ID') >= 0 && !data.deploymentSelected}
                    />
                    <DataTable.Column
                        label="Contained in"
                        name="host_id"
                        width="7%"
                        show={fieldsToShow.indexOf('Contained in') >= 0}
                    />
                    <DataTable.Column
                        label="Connected to"
                        width="7%"
                        show={fieldsToShow.indexOf('Connected to') >= 0}
                    />
                    <DataTable.Column label="Host" name="host_id" width="7%" show={fieldsToShow.indexOf('Host') >= 0} />
                    <DataTable.Column
                        label="Creator"
                        name="created_by"
                        width="7%"
                        show={fieldsToShow.indexOf('Creator') >= 0}
                    />
                    <DataTable.Column
                        label="# Instances"
                        name="actual_number_of_instances"
                        width="9%"
                        show={fieldsToShow.indexOf('# Instances') >= 0}
                    />
                    <DataTable.Column
                        label="Groups"
                        width="10%"
                        show={
                            fieldsToShow.indexOf('Groups') >= 0 && (data.blueprintSelected || data.deploymentSelected)
                        }
                    />

                    {data.items.map(node => {
                        return (
                            <DataTable.RowExpandable key={node.id + node.deployment_id} expanded={node.isSelected}>
                                <DataTable.Row
                                    key={node.id + node.deployment_id}
                                    selected={node.isSelected}
                                    onClick={() => this.selectNode(node)}
                                >
                                    <DataTable.Data className="center aligned">
                                        <NodeTypeIcon typeHierarchy={node.type_hierarchy} />
                                    </DataTable.Data>
                                    <DataTable.Data>
                                        <a className="nodeName" href="#!">
                                            {node.id}
                                        </a>
                                    </DataTable.Data>
                                    <DataTable.Data>
                                        <div>
                                            {node.type}
                                            <Popup hoverable>
                                                <Popup.Trigger>
                                                    <Icon
                                                        name="sitemap"
                                                        link
                                                        bordered
                                                        className="rightFloated"
                                                        onClick={event => event.stopPropagation()}
                                                    />
                                                </Popup.Trigger>
                                                <Popup.Header>
                                                    Type Hierarchy
                                                    <CopyToClipboardButton
                                                        text={String(node.type_hierarchy)}
                                                        className="rightFloated"
                                                    />
                                                </Popup.Header>
                                                <Popup.Content>
                                                    <TypeHierarchyTree typeHierarchy={node.type_hierarchy} />
                                                </Popup.Content>
                                            </Popup>
                                        </div>
                                    </DataTable.Data>
                                    <DataTable.Data>{node.blueprint_id}</DataTable.Data>
                                    <DataTable.Data>{node.deployment_display_name}</DataTable.Data>
                                    <DataTable.Data>{node.deployment_id}</DataTable.Data>
                                    <DataTable.Data>{node.containedIn}</DataTable.Data>
                                    <DataTable.Data>{node.connectedTo}</DataTable.Data>
                                    <DataTable.Data>{node.host_id}</DataTable.Data>
                                    <DataTable.Data>{node.created_by}</DataTable.Data>
                                    <DataTable.Data>
                                        <div className="ui green horizontal label">{node.numberOfInstances}</div>
                                    </DataTable.Data>
                                    <DataTable.Data>{node.groups}</DataTable.Data>
                                </DataTable.Row>

                                <DataTable.DataExpandable key={`${node.id + node.deployment_id}_Expanded`}>
                                    <NodeInstancesTable instances={node.instances} widget={widget} toolbox={toolbox} />
                                </DataTable.DataExpandable>
                            </DataTable.RowExpandable>
                        );
                    })}
                </DataTable>
            </div>
        );
    }
}

NodesTable.propTypes = {
    data: PropTypes.shape({
        blueprintSelected: PropTypes.bool,
        deploymentSelected: PropTypes.bool,
        items: PropTypes.arrayOf(
            PropTypes.shape({
                blueprint_id: PropTypes.string,
                connectedTo: PropTypes.string,
                containedIn: PropTypes.string,
                created_by: PropTypes.string,
                deployment_id: PropTypes.string,
                groups: PropTypes.string,
                host_id: PropTypes.string,
                id: PropTypes.string,
                instances: PropTypes.arrayOf(NodeInstancePropType),
                isSelected: PropTypes.bool,
                numberOfInstances: PropTypes.number,
                type: PropTypes.string,
                type_hierarchy: PropTypes.arrayOf(PropTypes.string)
            })
        ),
        total: PropTypes.number
    }).isRequired,
    widget: Stage.PropTypes.Widget.isRequired,
    toolbox: Stage.PropTypes.Toolbox.isRequired
};

function NodeTypeIcon({ typeHierarchy }) {
    const icon = icons.getNodeIcon(_.reverse(_.clone(typeHierarchy)));

    return <span style={{ fontSize: 20, fontFamily: 'cloudify' }}>{icon}</span>;
}

NodeTypeIcon.propTypes = {
    typeHierarchy: PropTypes.arrayOf(PropTypes.string).isRequired
};

function TypeHierarchyTree({ typeHierarchy }) {
    const { Icon, NodesTree } = Stage.Basic;

    const getNodes = types => {
        const type = types[0];
        if (types.length > 1) {
            return (
                <NodesTree.Node
                    key={type}
                    title={
                        <span>
                            <Icon name="triangle down" />
                            {type}
                        </span>
                    }
                >
                    {getNodes(_.slice(types, 1))}
                </NodesTree.Node>
            );
        }
        return (
            <NodesTree.Node
                key={type}
                title={
                    <span>
                        <strong>{type}</strong>
                    </span>
                }
            />
        );
    };

    return (
        <NodesTree showLine selectable={false} defaultExpandAll className="typesHierarchy">
            {getNodes(typeHierarchy)}
        </NodesTree>
    );
}

TypeHierarchyTree.propTypes = {
    typeHierarchy: PropTypes.arrayOf(PropTypes.string).isRequired
};
