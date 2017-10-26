/**
 * Created by aleksander laktionow on 19/10/2017.
 */
import React from 'react';

export default class ResetPagesModal extends React.Component {

    constructor(props,context) {
        super(props,context);

        this.state = ResetPagesModal.initialState;
        this.state.tenants = props.tenants.items.map((entry) => entry.name);
    }

    static initialState = {
        loading: false,
        tenants: [],
        errors: {}
    }

    toggleCheckbox(event, elem){
        let clickedTenant = elem.name;
        let newTenants = [...this.state.tenants];

        if (_.includes(this.state.tenants, clickedTenant)) {
            newTenants = _.pull(newTenants, clickedTenant);
        } else {
            newTenants.push(clickedTenant);
        }

        this.setState({tenants: newTenants}, () => console.error(this.state.tenants));
    }

    render() {
        var {Modal, Icon, ApproveButton, CancelButton, Checkbox, List, Card, Confirm} = Stage.Basic;

        return (
            this.props.tenants.items.length > 1
            ?
                <Modal size="small" className="tiny" open={this.props.open} onClose={this.props.onHide}>
                    <Modal.Header>
                        <Icon name="user"/> Reset pages for tenants
                    </Modal.Header>

                    <Modal.Content>
                            Please select tenants you would like to reset pages for:<br/>

                            <Card fluid><Card.Content>
                            <List relaxed>
                                {this.props.tenants.items.map((tenant) => {
                                    return (
                                        <List.Item key={tenant.name}><Checkbox name={tenant.name} defaultChecked onChange={this.toggleCheckbox.bind(this)} label={tenant.name}/></List.Item>
                                    );
                                })}
                            </List></Card.Content></Card>
                    </Modal.Content>

                    <Modal.Actions>
                        <CancelButton onClick={this.props.onHide} disabled={this.state.loading} />
                        <ApproveButton onClick={()=>this.props.onConfirm(this.state.tenants)} disabled={this.state.loading || _.isEmpty(this.state.tenants)}
                                       icon="undo" color="green" content="Reset" />
                    </Modal.Actions>
                </Modal>
            :
                <Confirm content='Are you sure you want to reset application screens to default?'
                         open={this.props.open} onClose={this.props.onHide}
                         onConfirm={()=>this.props.onConfirm(this.state.tenants)}
                         onCancel={this.props.onHide} />
        );
    }
};
