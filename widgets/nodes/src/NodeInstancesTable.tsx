import type { ExtendedNodeInstance } from './types';
import InstanceModal from './NodeInstanceModal';

interface NodeInstancesTableProps {
    instances: ExtendedNodeInstance[];
    toolbox: Stage.Types.Toolbox;
}

interface NodeInstancesTableState {
    instance?: ExtendedNodeInstance;
}

export default class NodeInstancesTable extends React.Component<NodeInstancesTableProps, NodeInstancesTableState> {
    constructor(props: NodeInstancesTableProps) {
        super(props);

        this.state = {
            instance: undefined
        };
    }

    closeInstanceModal = () => {
        this.setState({
            instance: undefined
        });
        return true;
    };

    showInstanceModal(instance: ExtendedNodeInstance) {
        this.setState({
            instance
        });
    }

    selectNodeInstance(item: ExtendedNodeInstance) {
        const { toolbox } = this.props;
        const selectedNodeInstanceId = toolbox.getContext().getValue('nodeInstanceId');
        const clickedNodeInstanceId = item.id;
        toolbox
            .getContext()
            .setValue(
                'nodeInstanceId',
                clickedNodeInstanceId === selectedNodeInstanceId ? null : clickedNodeInstanceId
            );
    }

    render() {
        const { instance: selectedInstance } = this.state;
        const { instances } = this.props;
        const NO_DATA_MESSAGE = 'There are no Node Instances of selected Node available.';
        const { CopyToClipboardButton, DataTable, Icon } = Stage.Basic;

        return (
            <div>
                <DataTable className="nodesInstancesTable" noDataMessage={NO_DATA_MESSAGE}>
                    <DataTable.Column label="Instance" name="id" width="40%" />
                    <DataTable.Column label="Status" name="state" width="30%" />
                    <DataTable.Column label="Details" name="details" width="30%" />

                    {instances.map(instance => {
                        return (
                            <DataTable.Row
                                key={instance.id}
                                selected={instance.isSelected}
                                onClick={() => this.selectNodeInstance(instance)}
                            >
                                <DataTable.Data>
                                    {instance.id}
                                    <CopyToClipboardButton text={instance.id} className="rightFloated" />
                                </DataTable.Data>
                                <DataTable.Data>{instance.state}</DataTable.Data>
                                <DataTable.Data textAlign="center" className="rowActions">
                                    <Icon
                                        link
                                        className="table"
                                        onClick={(event: Event) => {
                                            event.stopPropagation();
                                            this.showInstanceModal(instance);
                                        }}
                                    />
                                </DataTable.Data>
                            </DataTable.Row>
                        );
                    })}
                </DataTable>

                {selectedInstance && (
                    <InstanceModal open onClose={this.closeInstanceModal} instance={selectedInstance} />
                )}
            </div>
        );
    }
}
