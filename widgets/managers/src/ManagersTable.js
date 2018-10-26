/**
 * Created by jakub.niezgoda on 25/10/2018.
 */

import ManagerStatusIcon from './ManagerStatusIcon';
import ManagerConsoleIcon from './ManagerConsoleIcon';
import ManagerRefreshIcon from './ManagerRefreshIcon';
import ManagerSlavesDetails from './ManagerSlavesDetails';

export default class ManagersTable extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            selectedManagerId: null
        };
    }

    shouldComponentUpdate(nextProps, nextState) {
        return !_.isEqual(this.props.widget, nextProps.widget)
            || !_.isEqual(this.state, nextState)
            || !_.isEqual(this.props.data, nextProps.data);
    }

    refreshData() {
        this.props.toolbox.refresh();
    }

    componentDidMount() {
        this.props.toolbox.getEventBus().on('managers:refresh', this.refreshData, this);
    }

    componentWillUnmount() {
        this.props.toolbox.getEventBus().off('managers:refresh', this.refreshData);
    }

    selectManager(manager){
        let selectedManagerId = this.state.selectedManagerId;
        let clickedManagerId = manager.id;
        let clickedAlreadySelectedManager = clickedManagerId === selectedManagerId;
        this.setState({selectedManagerId: clickedAlreadySelectedManager ? null : manager.id});
    }

    render() {
        const NO_DATA_MESSAGE = 'There are no Managers available.';
        const configuration = this.props.widget.configuration;
        const fieldsToShow = configuration.fieldsToShow;
        const totalSize = this.props.data.total > 0 ? undefined : 0;

        let {DataTable, ErrorMessage} = Stage.Basic;

        return (
            <div>
                <ErrorMessage error={this.state.error} onDismiss={() => this.setState({error: null})} autoHide={true} />

                <DataTable selectable={false} noDataMessage={NO_DATA_MESSAGE} totalSize={totalSize}>

                    <DataTable.Column label="Deployment"
                                      show={fieldsToShow.indexOf('Deployment') >= 0}/>
                    <DataTable.Column label="IP"
                                      show={fieldsToShow.indexOf('IP') >= 0}/>
                    <DataTable.Column label="Status"
                                      show={fieldsToShow.indexOf('Status') >= 0}/>
                    <DataTable.Column label="Actions"
                                      show={fieldsToShow.indexOf('Actions') >= 0}/>

                    {
                        _.map(this.props.data.items, (manager) => {
                            return (
                                <DataTable.RowExpandable key={manager.id} expanded={manager.id === this.state.selectedManagerId}>

                                    <DataTable.Row key={manager.id} selected={manager.id === this.state.selectedManagerId}
                                                   onClick={this.selectManager.bind(this, manager)}>
                                        <DataTable.Data>
                                            {manager.id}
                                        </DataTable.Data>
                                        <DataTable.Data>
                                            {manager.ip}
                                        </DataTable.Data>
                                        <DataTable.Data>
                                            <ManagerStatusIcon status={manager.status} error={manager.error} />
                                        </DataTable.Data>
                                        <DataTable.Data>
                                            <ManagerConsoleIcon manager={manager} />
                                            <ManagerRefreshIcon manager={manager} toolbox={this.props.toolbox} />
                                        </DataTable.Data>
                                    </DataTable.Row>

                                    <DataTable.DataExpandable key={manager.id}>
                                        <ManagerSlavesDetails slaves={manager.slaves} />
                                    </DataTable.DataExpandable>

                                </DataTable.RowExpandable>
                            )
                        })
                    }

                </DataTable>
            </div>
        );
    }
}
