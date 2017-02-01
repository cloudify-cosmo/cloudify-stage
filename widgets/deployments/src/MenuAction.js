/**
 * Created by kinneretzin on 19/10/2016.
 */

export default class MenuAction extends React.Component {

    static EDIT_ACTION='edit';
    static DELETE_ACTION='delete';
    static WORKFLOW_ACTION='workflow';


    _actionClick(workflowAction, proxy, {value}) {
        if (workflowAction) {
            var workflow = _.find(this.props.item.workflows,{name: value});
            console.log('selected workflow '+ value,workflow);
            this.props.onSelectAction(value, this.props.item, workflow);
        } else {
            this.props.onSelectAction(value, this.props.item);
        }
    }

    render () {
        var {Dropdown, Icon} = Stage.Basic;

        return (
            <Dropdown pointing="top right" icon="content">
                <Dropdown.Menu>
                    <Dropdown.Header icon="road" content="Execute workflow"/>
                    <Dropdown.Divider />
                    {
                        this.props.item.workflows.map((workflow)=>{
                            return <Dropdown.Item text={_.capitalize(_.lowerCase(workflow.name))} className="indent"
                                                  key={workflow.name} value={workflow.name} onClick={this._actionClick.bind(this, true)}/>
                        })
                    }
                    <Dropdown.Divider />
                    <Dropdown.Item icon='edit' text='Edit' value={MenuAction.EDIT_ACTION} onClick={this._actionClick.bind(this, false)}/>
                    <Dropdown.Item icon='trash' text='Delete' value={MenuAction.DELETE_ACTION} onClick={this._actionClick.bind(this, false)} />
                </Dropdown.Menu>
            </Dropdown>
        );
    }
}
