/**
 * Created by jakubniezgoda on 03/01/2017.
 */

import NodeInstancesTable from './NodeInstancesTable';

export default class NodesTable extends React.Component {
    constructor(props,context) {
        super(props,context);

        this.state = {
            error: null
        };
    }

    shouldComponentUpdate(nextProps, nextState) {
        return !_.isEqual(this.props.widget, nextProps.widget)
            || !_.isEqual(this.state, nextState)
            || !_.isEqual(this.props.data, nextProps.data);
    }

    _refreshData() {
        this.props.toolbox.refresh();
    }

    _selectNode (item){
        let selectedDepNodeId = this.props.toolbox.getContext().getValue('depNodeId');
        let clickedDepNodeId = item.id + item.deployment_id;
        let clickedAlreadySelectedNode = clickedDepNodeId === selectedDepNodeId;
        this.props.toolbox.getContext().setValue('depNodeId', clickedAlreadySelectedNode ? null : clickedDepNodeId);
        this.props.toolbox.getContext().setValue('nodeId', clickedAlreadySelectedNode ? null : item.id);
        this.props.toolbox.getContext().setValue('nodeInstanceId', null);
        this.props.toolbox.getEventBus().trigger('topology:selectNode', clickedAlreadySelectedNode ? null : item.id);
    }

    componentDidMount() {
        this.props.toolbox.getEventBus().on('nodes:refresh', this._refreshData, this);
    }

    componentWillUnmount() {
        this.props.toolbox.getEventBus().off('nodes:refresh', this._refreshData);
    }

    fetchGridData(fetchParams) {
        return this.props.toolbox.refresh(fetchParams);
    }

    render() {
        const NO_DATA_MESSAGE = 'There are no Nodes available. Probably there\'s no deployment created, yet.';
        let {CopyToClipboardButton, DataTable, ErrorMessage, Icon, Popup} = Stage.Basic;

        let fieldsToShow = this.props.widget.configuration.fieldsToShow;

        return (
            <div>
                <ErrorMessage error={this.state.error} onDismiss={() => this.setState({error: null})} autoHide={true}/>

                <DataTable fetchData={this.fetchGridData.bind(this)}
                           totalSize={this.props.data.total}
                           pageSize={this.props.widget.configuration.pageSize}
                           sortColumn={this.props.widget.configuration.sortColumn}
                           sortAscending={this.props.widget.configuration.sortAscending}
                           searchable={true}
                           selectable={true}
                           className="nodesTable"
                           noDataMessage={NO_DATA_MESSAGE}>

                    <DataTable.Column width="5%"/>
                    <DataTable.Column label="Name" name="id" width="15%"
                                      show={fieldsToShow.indexOf('Name') >= 0}/>
                    <DataTable.Column label="Type" name="type" width="20%"
                                      show={fieldsToShow.indexOf('Type') >= 0}/>
                    <DataTable.Column label="Blueprint" name="blueprint_id" width="10%"
                                      show={fieldsToShow.indexOf('Blueprint') >= 0 && _.isEmpty(this.props.data.blueprintId)} />
                    <DataTable.Column label="Deployment" name="deployment_id" width="10%"
                                      show={fieldsToShow.indexOf('Deployment') >= 0 && _.isEmpty(this.props.data.deploymentId)} />
                    <DataTable.Column label="Contained in" name="host_id" width="7%"
                                      show={fieldsToShow.indexOf('Contained in') >= 0}/>
                    <DataTable.Column label="Connected to" width="7%"
                                      show={fieldsToShow.indexOf('Connected to') >= 0}/>
                    <DataTable.Column label="Host" name='host_id' width="7%"
                                      show={fieldsToShow.indexOf('Host') >= 0}/>
                    <DataTable.Column label="Creator" name='created_by' width="7%"
                                      show={fieldsToShow.indexOf('Creator') >= 0}/>
                    <DataTable.Column label="# Instances" name="number_of_instances" width="9%"
                                      show={fieldsToShow.indexOf('# Instances') >= 0}/>
                    <DataTable.Column label="Groups" width="10%"
                                      show={fieldsToShow.indexOf('Groups') >= 0 && (!_.isEmpty(this.props.data.blueprintId) || !_.isEmpty(this.props.data.deploymentId))} />

                    {
                        this.props.data.items.map((node) => {
                            return (
                                <DataTable.RowExpandable key={node.id + node.deployment_id} expanded={node.isSelected}>

                                    <DataTable.Row key={node.id + node.deployment_id} selected={node.isSelected} onClick={this._selectNode.bind(this, node)}>
                                        <DataTable.Data className='center aligned'><NodeTypeIcon typeHierarchy={node.type_hierarchy} /></DataTable.Data>
                                        <DataTable.Data><a className='nodeName' href="javascript:void(0)">{node.id}</a></DataTable.Data>
                                        <DataTable.Data>
                                            <div>
                                                {node.type}
                                                <Popup hoverable>
                                                    <Popup.Trigger>
                                                        <Icon name='sitemap' link bordered className='rightFloated'
                                                              onClick={(event) => event.stopPropagation()} />
                                                    </Popup.Trigger>
                                                    <Popup.Header>
                                                        Type Hierarchy
                                                        <CopyToClipboardButton text={String(node.type_hierarchy)} className='rightFloated' />
                                                    </Popup.Header>
                                                    <Popup.Content>
                                                        <TypeHierarchyTree typeHierarchy={node.type_hierarchy} />
                                                    </Popup.Content>
                                                </Popup>
                                            </div>
                                        </DataTable.Data>
                                        <DataTable.Data>{node.blueprint_id}</DataTable.Data>
                                        <DataTable.Data>{node.deployment_id}</DataTable.Data>
                                        <DataTable.Data>{node.containedIn}</DataTable.Data>
                                        <DataTable.Data>{node.connectedTo}</DataTable.Data>
                                        <DataTable.Data>{node.host_id}</DataTable.Data>
                                        <DataTable.Data>{node.created_by}</DataTable.Data>
                                        <DataTable.Data><div className="ui green horizontal label">{node.numberOfInstances}</div></DataTable.Data>
                                        <DataTable.Data>{node.groups}</DataTable.Data>
                                    </DataTable.Row>

                                    <DataTable.DataExpandable key={`${node.id + node.deployment_id}_Expanded`}>
                                        <NodeInstancesTable instances={node.instances} widget={this.props.widget} toolbox={this.props.toolbox} />
                                    </DataTable.DataExpandable>

                                </DataTable.RowExpandable>
                            );
                        })
                    }
                </DataTable>
            </div>

        );
    }
};

function NodeTypeIcon(props) {
    let nodeTypeClass = null;
    const NODE_TYPE_CLASS = {
        'cloudify.nodes.ApplicationModule':'topology-glyph app-module', //a base type for any application module or artifact
        'cloudify.nodes.ApplicationServer':'topology-glyph app-server', //An application server
        'cloudify.nodes.Compute':'topology-glyph host', //A compute resource either a virtual or a physical host
        'cloudify.nodes.Database':'topology-glyph db-server', //a Database
        'cloudify.nodes.DBMS':'topology-glyph db-server', //a Database
        'cloudify.nodes.FileSystem':'topology-glyph blob-storage', //A Writable File System. This type must be used in conjunction with a Volume type and a Compute type.
        'cloudify.nodes.LoadBalancer':'topology-glyph load-balancer', //A virtualized Load Balancer
        'cloudify.nodes.MessageBusServer':'topology-glyph message-bus-server', //a message bus server
        'cloudify.nodes.Network':'topology-glyph switch', //A virtual network
        'cloudify.nodes.ObjectStorage':'topology-glyph blob-storage', //A BLOB storage segment
        'cloudify.nodes.Port':'topology-glyph port', //An entry in a virtual subnet. Can be used in some clouds to secure a static private IP
        'cloudify.nodes.Root':'topology-glyph app-module', //The base type for all built-in types.
        'cloudify.nodes.Router':'topology-glyph router', //A virtual layer 3 router
        'cloudify.nodes.SecurityGroup':'topology-glyph security-group', //A cloud security group (VM network access rules)
        'cloudify.nodes.SoftwareComponent':'topology-glyph app-server', //A base type for all middleware level types
        'cloudify.nodes.Subnet':'topology-glyph subnet', //A virtual segment of IP addresses in a network
        'cloudify.nodes.Tier':'topology-glyph tier', //A marker for a future scale group
        'cloudify.nodes.VirtualIP':'topology-glyph floating-ip', //A virtual IP implemented as NAT or in another manner
        'cloudify.nodes.Volume':'topology-glyph volume', //A persistent block storage volume
        'cloudify.nodes.WebServer':'topology-glyph web-server' //A web server
    };
    const DEFAULT_NODE_TYPE_CLASS = NODE_TYPE_CLASS['cloudify.nodes.Root'];

    _.eachRight(props.typeHierarchy, type => !(nodeTypeClass = NODE_TYPE_CLASS[type]));

    return (
        <i className={nodeTypeClass || DEFAULT_NODE_TYPE_CLASS} />
    )
}

function TypeHierarchyTree(props) {
    let {Icon, NodesTree} = Stage.Basic;

    const getNodes = (types) => {
        let type = types[0];
        if (types.length > 1) {
            return (
                <NodesTree.Node key={type} title={<span><Icon name='triangle down' />{type}</span>}>
                    {getNodes(_.slice(types, 1))}
                </NodesTree.Node>
            );
        } else {
            return (
                <NodesTree.Node key={type} title={<span><strong>{type}</strong></span>} />
            );
        }
    };

    return (
        <NodesTree showLine selectable={false} defaultExpandAll className='typesHierarchy'>
            {getNodes(props.typeHierarchy)}
        </NodesTree>
    );
}