/**
 * Created by jakubniezgoda on 03/02/2017.
 */

export default class MenuAction extends React.Component {

    static ADD_USER_ACTION='user';
    static ADD_TENANT_ACTION='tenant';
    static DELETE_ACTION='delete';

    _actionClick(proxy, {value}) {
        this.props.onSelectAction(value, this.props.item);
    }

    render () {
        var {Dropdown, Icon} = Stage.Basic;

        return (
            <Dropdown pointing="top right" icon="content">
                <Dropdown.Menu>
                    <Dropdown.Item icon='users' text='Add user to group' value={MenuAction.ADD_USER_ACTION} onClick={this._actionClick.bind(this)}/>
                    <Dropdown.Item icon='user' text='Add group to tenant' value={MenuAction.ADD_TENANT_ACTION} onClick={this._actionClick.bind(this)}/>
                    <Dropdown.Divider />
                    <Dropdown.Item icon='trash' text='Delete' value={MenuAction.DELETE_ACTION} onClick={this._actionClick.bind(this)}/>
                </Dropdown.Menu>
            </Dropdown>
        );
    }
}
