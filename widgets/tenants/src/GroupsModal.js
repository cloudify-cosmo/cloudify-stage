/**
 * Created by jakubniezgoda on 01/02/2017.
 */

import Actions from './actions';

let PropTypes = React.PropTypes;

export default class GroupsModal extends React.Component {

    constructor(props,context) {
        super(props,context);

        this.state = {
            ...GroupsModal.initialState
        }
    }

    static initialState = {
        userGroups: [],
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
        this.refs.editForm.submit();
        return false;
    }

    onDeny () {
        this.props.onHide();
        return true;
    }

    componentWillReceiveProps(nextProps) {
        if (!this.props.show && nextProps.show) {
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

        let userGroupsToAdd = _.difference(this.state.userGroups, this.props.tenant.groups);
        let userGroupsToRemove = _.difference(this.props.tenant.groups, this.state.userGroups);

        let actions = new Actions(this.props.toolbox);
        actions.doHandleUserGroups(this.props.tenant.name, userGroupsToAdd, userGroupsToRemove).then(()=>{
            this.setState({loading: false});
            this.props.toolbox.refresh();
            this.props.onHide();
        }).catch((err)=>{
            this.setState({errors: {error: err.message}, loading: false});
        });
    }

    _handleInputChange(proxy, field) {
        this.setState(Stage.Basic.Form.fieldNameValue(field));
    }

    render() {
        let {Modal, Icon, Form} = Stage.Basic;

        let tenant = this.props.tenant;
        let userGroups = _.map(this.props.userGroups.items, (userGroup) => { return {text: userGroup.name, value: userGroup.name, key: userGroup.name} });

        return (
        <Modal show={this.props.show} loading={this.state.loading} onDeny={this.onDeny.bind(this)} onApprove={this.onApprove.bind(this)}>
            <Modal.Header>
                <Icon name="users"/> Modify user groups for {tenant.name}
            </Modal.Header>

            <Modal.Body>
                <Form onSubmit={this._updateTenant.bind(this)} errors={this.state.errors} ref="editForm">
                    <Form.Field>
                        <Form.Dropdown placeholder='Groups' multiple search selection options={userGroups} name="userGroups"
                                       value={this.state.userGroups} onChange={this._handleInputChange.bind(this)}/>
                    </Form.Field>
                </Form>
            </Modal.Body>

            <Modal.Footer>
                <Modal.Cancel/>
                <Modal.Approve label="Save" icon="users" className="green"/>
            </Modal.Footer>
        </Modal>
        );
    }
};
