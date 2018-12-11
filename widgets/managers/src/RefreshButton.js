/**
 * Created by jakub.niezgoda on 31/10/2018.
 */

import PropTypes from 'prop-types';

export default class RefreshButton extends React.Component {

    constructor(props, context){
        super(props, context);

        this.state = {
            loading: false
        }
    }

    static propTypes = {
        managers: PropTypes.array.isRequired,
        toolbox: PropTypes.object.isRequired,
        onSuccess: PropTypes.func,
        onFail: PropTypes.func
    };

    static defaultProps = {
        onSuccess: _.noop,
        onFail: _.noop
    };

    handleClick(event) {
        event.stopPropagation();

        this.setState({loading: true});

        const executionStatusCheckInterval = 2000; //ms
        let {DeploymentActions, ExecutionActions} = Stage.Common;
        let deploymentActions = new DeploymentActions(this.props.toolbox);
        let executionActions = new ExecutionActions(this.props.toolbox);
        let executePromises = _.map(this.props.managers, (manager) =>
            deploymentActions.doExecute({id: manager}, {name: 'get_status'}, {})
        );

        return Promise.all(executePromises)
            .then((results) => {
                this.props.toolbox.refresh();
                return executionActions.waitUntilFinished(_.map(results, (result) => result.id), executionStatusCheckInterval);
            })
            .then((result) => this.props.onSuccess(result))
            .catch((error) => this.props.onFail(error.message))
            .finally(() => this.setState({loading: false}));
    }

    render() {
        let {Button, Popup} = Stage.Basic;
        let managers = this.props.managers;

        return (
            <Popup on={_.isEmpty(managers) || this.state.loading ? 'hover' : []}
                   open={_.isEmpty(managers) || this.state.loading ? undefined : false}>
                <Popup.Trigger>
                    <div>
                        <Button icon='refresh' content='Refresh Status'
                                labelPosition='left' disabled={_.isEmpty(managers) || this.state.loading}
                                loading={this.state.loading}
                                onClick={this.handleClick.bind(this)} />
                    </div>
                </Popup.Trigger>

                <Popup.Content>
                    {
                        this.state.loading
                        ? 'Bulk status refresh in progress...'
                        : 'Tick at least one manager to perform bulk status refresh'
                    }
                </Popup.Content>
            </Popup>


        );
    }
}

