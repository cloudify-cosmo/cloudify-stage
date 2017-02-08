/**
 * Created by jakubniezgoda on 01/02/2017.
 */

let PropTypes = React.PropTypes;

export default class MenuAction extends React.Component {

    static EDIT_USERS_ACTION = 'users';
    static EDIT_USER_GROUPS_ACTION = 'user-groups';
    static DELETE_TENANT_ACTION = 'delete';

    static propTypes = {
        tenant: PropTypes.object.isRequired,
        onSelectAction: PropTypes.func.isRequired
    };

    _onDropdownChange(event, data) {
        this.props.onSelectAction(data.value, this.props.tenant);
    }

    render () {
        let Dropdown = Stage.Basic.Dropdown;

        return (
            <Dropdown pointing="top right" icon="content">
                <Dropdown.Menu>
                    <Dropdown.Item icon='user' text='Edit users'
                                   value={MenuAction.EDIT_USERS_ACTION}
                                   onClick={this._onDropdownChange.bind(this)}/>
                    <Dropdown.Item icon='users' text='Edit user groups'
                                   value={MenuAction.EDIT_USER_GROUPS_ACTION}
                                   onClick={this._onDropdownChange.bind(this)}/>
                    <Dropdown.Divider />
                    <Dropdown.Item icon='trash' text='Delete'
                                   value={MenuAction.DELETE_TENANT_ACTION}
                                   onClick={this._onDropdownChange.bind(this)}/>
                </Dropdown.Menu>
            </Dropdown>
        )
    }
}
