/**
 * Created by jakub.niezgoda on 31/10/2018.
 */

import PropTypes from 'prop-types';

export default class RefreshButton extends React.Component {

    constructor(props, context){
        super(props, context);
    }

    static propTypes = {
        managers: PropTypes.array.isRequired,
        toolbox: PropTypes.object.isRequired
    };

    handleClick(event) {
        event.stopPropagation();

        let actions = new Stage.Common.DeploymentActions(this.props.toolbox);
        let executePromises = _.map(this.props.managers, (manager) =>
            actions.doExecute({id: manager}, {name: 'get_status'}, {})
        );

        return Promise.all(executePromises);
    }

    render() {
        let {Button, Popup} = Stage.Basic;
        let managers = this.props.managers;

        return (
            <Popup on={_.isEmpty(managers) ? 'hover' : []}
                   open={_.isEmpty(managers) ? undefined : false}>
                <Popup.Trigger>
                    <div>
                        <Button icon='refresh' content='Refresh Status'
                                labelPosition='left' disabled={_.isEmpty(managers)}
                                onClick={this.handleClick.bind(this)} />
                    </div>
                </Popup.Trigger>

                <Popup.Content>
                    Tick at least one manager to perform bulk status refresh
                </Popup.Content>
            </Popup>


        );
    }
}

