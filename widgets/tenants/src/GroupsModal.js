/**
 * Created by jakubniezgoda on 01/02/2017.
 */

import Actions from './actions';

let PropTypes = React.PropTypes;
const RolesPicker = Stage.Common.RolesPicker;
const RolesUtil = Stage.Common.RolesUtil;

export default class GroupsModal extends React.Component {

    constructor(props,context) {
        super(props,context);

        this.state = {
            ...GroupsModal.initialState
        }
    }

    static initialState = {
        userGroups: {},
        loading: false,
        errors: {}
    }

    static propTypes = {
        tenant: PropTypes.object.isRequired,
        userGroups: PropTypes.object.isRequired,
        toolbox: PropTypes.object.isRequired,
        onHide: PropTypes.func
    };

    static defaultProps = {
        onHide: ()=>{}
    };

    onApprove () {
        this._updateTenant();
        return false;
    }

    onCancel () {
        this.props.onHide();
        return true;
    }

    onRoleChange(group, role){
        var newUserGroups = Object.assign({}, this.state.userGroups);
        newUserGroups[group] = role;
        this.setState({userGroups: newUserGroups});
    }

    componentWillReceiveProps(nextProps) {
        if (!this.props.open && nextProps.open) {
            this.setState({
                ...GroupsModal.initialState,
                userGroups: nextProps.tenant.groups
            });
        }
    }

    _updateTenant() {
        let errors = {};

        // Disable the form
        this.setState({loading: true});

        var userGroups = this.props.tenant.groups;
        var userGroupsList = Object.keys(userGroups);
        var submitUserGroups = this.state.userGroups;
        var submitUserGroupsList = Object.keys(submitUserGroups);

        let userGroupsToAdd = _.pick(submitUserGroups, _.difference(submitUserGroupsList, userGroupsList));
        let userGroupsToRemove = _.difference(userGroupsList, submitUserGroupsList);
        let userGroupsToUpdate = _.pickBy(submitUserGroups, (role, group) => {
            return userGroups[group] && !_.isEqual(userGroups[group], role);
        });

        let actions = new Actions(this.props.toolbox);
        actions.doHandleUserGroups(this.props.tenant.name, userGroupsToAdd, userGroupsToRemove, userGroupsToUpdate).then(()=>{
            this.setState({errors: {}, loading: false});
            this.props.toolbox.refresh();
            this.props.toolbox.getEventBus().trigger('userGroups:refresh');
            this.props.toolbox.getEventBus().trigger('users:refresh');
            this.props.onHide();
        }).catch((err)=>{
            this.setState({errors: {error: err.message}, loading: false});
        });
    }

    _handleInputChange(proxy, field) {
        var newUserGroups = {};
        _.forEach(field.value, (group) => {
            newUserGroups[group] = this.state.userGroups[group] || RolesUtil.getDefaultRoleName(this.props.toolbox.getManager()._data.roles);
        });

        this.setState({userGroups: newUserGroups});
    }

    render() {
        let {Modal, Icon, Form, CancelButton, ApproveButton} = Stage.Basic;

        let tenant = this.props.tenant;
        let userGroups = _.map(this.props.userGroups.items, (userGroup) => { return {text: userGroup.name, value: userGroup.name, key: userGroup.name} });

        return (
        <Modal open={this.props.open} onClose={()=>this.props.onHide()}>
            <Modal.Header>
                <Icon name="users"/> Modify user groups for {tenant.name}
            </Modal.Header>

            <Modal.Content>
                <Form loading={this.state.loading} errors={this.state.errors}
                      onErrorsDismiss={() => this.setState({errors: {}})}>
                    <Form.Field>
                        <Form.Dropdown placeholder='Groups' multiple selection closeOnChange options={userGroups} name="userGroups"
                                       value={Object.keys(this.state.userGroups)} onChange={this._handleInputChange.bind(this)}/>
                    </Form.Field>
                    <RolesPicker onUpdate={this.onRoleChange.bind(this)} resources={this.state.userGroups} resourceName="user group" toolbox={this.props.toolbox}></RolesPicker>
                </Form>
            </Modal.Content>

            <Modal.Actions>
                <CancelButton onClick={this.onCancel.bind(this)} disabled={this.state.loading} />
                <ApproveButton onClick={this.onApprove.bind(this)} disabled={this.state.loading} icon="users" color="green" />
            </Modal.Actions>
        </Modal>
        );
    }
};
