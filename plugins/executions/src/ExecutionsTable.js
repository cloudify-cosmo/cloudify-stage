/**
 * Created by kinneretzin on 20/10/2016.
 */

export default class extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
        };
    }

    _refreshData() {
        this.props.context.refresh();
    }

    componentDidMount() {
        this.props.context.getEventBus().on('executions:refresh', this._refreshData, this);
    }

    componentWillUnmount() {
        this.props.context.getEventBus().off('executions:refresh', this._refreshData);
    }

    _selectExecution(item) {
        var oldSelectedExecutionId = this.props.context.getValue('executionId');
        this.props.context.setValue('executionId',item.id === oldSelectedExecutionId ? null : item.id);
    }

    renderFields(fieldsToShow,item) {
        var HighlightText = Stage.Basic.HighlightText;
        var Overlay = Stage.Basic.Overlay;
        var OverlayAction = Stage.Basic.OverlayAction;
        var OverlayContent = Stage.Basic.OverlayContent;
        var Checkmark = Stage.Basic.Checkmark;

        var fields = [];

        if (fieldsToShow.indexOf("Blueprint") >= 0 && !this.props.data.blueprintId) {
            fields.push(<td key={item.id+'Blueprint'}>{item.blueprint_id}</td>)
        }
        if (fieldsToShow.indexOf("Deployment") >= 0 && !this.props.data.deploymentId) {
            fields.push(<td key={item.id+'Deployment'}>{item.deployment_id}</td>);
        }

        if (fieldsToShow.indexOf("Workflow") >= 0) {
            fields.push(<td key={item.id+'Workflow'}>{item.workflow_id}</td>);
        }

        if (fieldsToShow.indexOf("Id") >= 0 ) {
            fields.push(<td key={item.id+'Id'}>{item.id}</td>);
        }
        if (fieldsToShow.indexOf("Created") >= 0) {
            fields.push(<td key={item.id+'Created'}>{item.created_at}</td>);
        }
        if (fieldsToShow.indexOf("IsSystem") >= 0) {
            fields.push(<td key={item.id+'IsSystem'}><Checkmark value={item.is_system_workflow}/></td>);
        }
        if (fieldsToShow.indexOf("Params") >= 0) {
            fields.push(
                <td key={item.id+'Params'}>
                    <Overlay>
                        <OverlayAction>
                            <i data-overlay-action className="options icon link bordered" title="Execution parameters"></i>
                        </OverlayAction>
                        <OverlayContent>
                            <HighlightText className='json'>{JSON.stringify(item.parameters, null, 2)}</HighlightText>
                        </OverlayContent>
                    </Overlay>
                </td>
            );
        }
        if (fieldsToShow.indexOf("Status") >= 0) {
            fields.push(
                <td key={item.id+'Status'}>
                    { _.isEmpty(item.error) ?
                        <i className="check circle icon inverted green"></i>
                        :
                        <Overlay>
                            <OverlayAction>
                                <i data-overlay-action className="remove circle icon red link bordered" title="Error details"></i>
                            </OverlayAction>
                            <OverlayContent>
                                <HighlightText className='python'>{item.error}</HighlightText>
                            </OverlayContent>
                        </Overlay>
                    }
                    {item.status}
                </td>
            );
        }

        return fields;
    }

    render() {
        var fieldsToShowConfig = this.props.widget.configuration ? _.find(this.props.widget.configuration,{id:'fieldsToShow'}) : {};
        var fieldsToShow = [];
        try {
            // First set it to default, so if abends in json parse will have the default
            fieldsToShow = _.find(this.props.widget.plugin.initialConfiguration,{id:'fieldsToShow'}) || ["Id"];

            fieldsToShow = (fieldsToShowConfig && fieldsToShowConfig.value) ? JSON.parse(fieldsToShowConfig.value) : fieldsToShow;

        } catch (e) {
            console.error('Error parsing fields-to-show configuration for executions table');
        }

        var ErrorMessage = Stage.Basic.ErrorMessage;

        return (
            <div>
                <ErrorMessage error={this.state.error}/>

                <table className="ui very compact table executionsTable">
                    <thead>
                    <tr>
                        { fieldsToShow.indexOf("Blueprint") >= 0 && !this.props.data.blueprintId? <th>Blueprint</th> : null}
                        { fieldsToShow.indexOf("Deployment") >= 0 && !this.props.data.deploymentId?<th>Deployment</th> : null}
                        { fieldsToShow.indexOf("Workflow") >= 0 ?<th>Workflow</th> : null}
                        { fieldsToShow.indexOf("Id") >= 0 ?<th>Id</th> : null}
                        { fieldsToShow.indexOf("Created") >= 0 ?<th>Created</th> : null}
                        { fieldsToShow.indexOf("IsSystem") >= 0 ?<th>Is System</th> : null}
                        { fieldsToShow.indexOf("Params") >= 0 ?<th>Params</th> : null}
                        { fieldsToShow.indexOf("Status") >= 0 ?<th>Status</th> : null}
                    </tr>
                    </thead>
                    <tbody>
                    {
                        this.props.data.items.map((item)=>{
                            return (
                                <tr key={item.id} className={'row ' + (item.isSelected ? 'active' : '')} onClick={this._selectExecution.bind(this,item)}>
                                    {this.renderFields(fieldsToShow,item)}
                                </tr>
                            );
                        })
                    }
                    </tbody>
                </table>
            </div>
        );
    }
}
