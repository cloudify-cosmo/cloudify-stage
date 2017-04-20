/**
 * Created by jakubniezgoda on 01/02/2017.
 */

import Actions from './actions';

let PropTypes = React.PropTypes;

export default class UsersModal extends React.Component {

    constructor(props,context) {
        super(props,context);

        this.state = {
            ...UsersModal.initialState
        }
    }

    static initialState = {
        users: [],
        loading: false,
        errors: {}
    }

    static propTypes = {
        tenant: PropTypes.object.isRequired,
        users: PropTypes.object.isRequired,
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

    componentWillReceiveProps(nextProps) {
        if (!this.props.open && nextProps.open) {
            this.setState({
                ...UsersModal.initialState,
                users: nextProps.tenant.users
            });
        }
    }

    _updateTenant() {
        let errors = {};

        // Disable the form
        this.setState({loading: true});

        let usersToAdd = _.difference(this.state.users, this.props.tenant.users);
        let usersToRemove = _.difference(this.props.tenant.users, this.state.users);

        let actions = new Actions(this.props.toolbox);
        actions.doHandleUsers(this.props.tenant.name, usersToAdd, usersToRemove).then(()=>{
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
        let {Modal, Icon, Form, ApproveButton, CancelButton} = Stage.Basic;

        let tenant = this.props.tenant;
        let users = _.map(this.props.users.items, (user) => { return {text: user.username, value: user.username, key: user.username} });

        return (
        <Modal open={this.props.open}>
            <Modal.Header>
                <Icon name="user"/> Modify users for tenant {tenant.name}
            </Modal.Header>

            <Modal.Content>
                <Form loading={this.state.loading} errors={this.state.errors}>
                    <Form.Field>
                        <Form.Dropdown placeholder='Users' multiple selection options={users} name="users"
                                       value={this.state.users} onChange={this._handleInputChange.bind(this)}/>
                    </Form.Field>
                </Form>
            </Modal.Content>

            <Modal.Actions>
                <CancelButton onClick={this.onCancel.bind(this)} disabled={this.state.loading} />
                <ApproveButton onClick={this.onApprove.bind(this)} disabled={this.state.loading} content="Save" icon="user" color="green"/>
            </Modal.Actions>
        </Modal>
        );
    }
};
