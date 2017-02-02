/**
 * Created by kinneretzin on 19/10/2016.
 */

export default class MenuAction extends React.Component {

    static SET_PASSWORD_ACTION='password';
    static SET_ROLE_ACTION='role';
    static ADD_TENANT_ACTION='tenant';
    static ADD_GROUP_ACTION='group';
    static DELETE_ACTION='delete';

    _actionClick(proxy, {value}) {
        this.props.onSelectAction(value, this.props.item);
    }

    render () {
        var {Dropdown, Icon} = Stage.Basic;

        return (
            <Dropdown pointing="top right" icon="content">
                <Dropdown.Menu>
                    <Dropdown.Item icon='lock' text='Set password' value={MenuAction.SET_PASSWORD_ACTION} onClick={this._actionClick.bind(this)}/>
                    <Dropdown.Item icon='male' text='Set role' value={MenuAction.SET_ROLE_ACTION} onClick={this._actionClick.bind(this)} />
                    <Dropdown.Divider />
                    <Dropdown.Item icon='users' text='Add to group' value={MenuAction.ADD_GROUP_ACTION} onClick={this._actionClick.bind(this)}/>
                    <Dropdown.Item icon='user' text='Add to tenant' value={MenuAction.ADD_TENANT_ACTION} onClick={this._actionClick.bind(this)}/>
                    <Dropdown.Divider />
                    <Dropdown.Item icon='trash' text='Delete' value={MenuAction.DELETE_ACTION} onClick={this._actionClick.bind(this)}/>
                </Dropdown.Menu>
            </Dropdown>
        );
    }
}
