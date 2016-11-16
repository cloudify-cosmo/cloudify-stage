/**
 * Created by kinneretzin on 20/10/2016.
 */

import Highlight from 'react-highlight';

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

    _showInOverlay(id) {
        $("#" + id).modal({"observeChanges": true}).modal("show");
    }

    renderFields(fieldsToShow,item) {
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
            fields.push(<td key={item.id+'IsSystem'}>{item.is_system_workflow ?
                        <i className="checkmark box icon grey" title="Yes"/>
                        :
                        <i className="square outline icon grey" title="No"/>
                    }
            </td>);
        }
        if (fieldsToShow.indexOf("Params") >= 0) {
            fields.push(
                <td key={item.id+'Params'}>
                    <i className="options icon link bordered" title="Execution parameters" onClick={this._showInOverlay.bind(true, item.id+'Params')}></i>
                    <div id={item.id+'Params'} className="ui large modal execOverlay"><div className="content"><Highlight className='json'>{JSON.stringify(item.parameters, null, 2)}</Highlight></div></div>
                </td>
            );
        }
        if (fieldsToShow.indexOf("Status") >= 0) {
            fields.push(
                <td key={item.id+'Status'}>
                    { _.isEmpty(item.error) ?
                        <i className="check circle icon inverted green"></i>
                        :
                        <div>
                            <i className="remove circle icon red link bordered" onClick={this._showInOverlay.bind(true, item.id+'Error')}></i>
                            <div id={item.id+'Error'} className="ui large modal execOverlay"><div className="content"><Highlight className='python'>{item.error}</Highlight></div></div>
                        </div>
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
