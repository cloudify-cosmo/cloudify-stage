/**
 * Created by aleksander laktionow on 19/10/2017.
 */
import React from 'react';

import { Modal, Icon, ApproveButton, CancelButton, Checkbox, List, Card, Confirm } from './basic';

export default class ResetPagesModal extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = ResetPagesModal.initialState;
        this.state.tenants = props.tenants.items.map(entry => entry.name);
    }

    static initialState = {
        loading: false,
        tenants: [],
        errors: {}
    };

    toggleCheckbox(event, elem) {
        const { tenants } = this.state;
        const clickedTenant = elem.name;
        let newTenants = [...tenants];

        if (_.includes(tenants, clickedTenant)) {
            newTenants = _.pull(newTenants, clickedTenant);
        } else {
            newTenants.push(clickedTenant);
        }

        this.setState({ tenants: newTenants }, () => console.error(tenants));
    }

    render() {
        const { loading } = this.state;
        const { onConfirm, onHide, open, tenants } = this.props;
        return tenants.items.length > 1 ? (
            <Modal className="tiny resetPagesModal" open={open} onClose={onHide}>
                <Modal.Header>
                    <Icon name="user" /> Reset pages for tenants
                </Modal.Header>

                <Modal.Content>
                    Please select tenants you would like to reset pages for:
                    <br />
                    <Card fluid>
                        <Card.Content>
                            <List relaxed>
                                {tenants.items.map(tenant => {
                                    return (
                                        <List.Item key={tenant.name}>
                                            <Checkbox
                                                name={tenant.name}
                                                defaultChecked
                                                onChange={this.toggleCheckbox.bind(this)}
                                                label={tenant.name}
                                            />
                                        </List.Item>
                                    );
                                })}
                            </List>
                        </Card.Content>
                    </Card>
                </Modal.Content>

                <Modal.Actions>
                    <CancelButton onClick={onHide} disabled={loading} />
                    <ApproveButton
                        onClick={() => onConfirm(tenants)}
                        disabled={loading || _.isEmpty(tenants)}
                        icon="undo"
                        color="green"
                        content="Reset"
                    />
                </Modal.Actions>
            </Modal>
        ) : (
            <Confirm
                content="Are you sure you want to reset application screens to default?"
                open={open}
                onClose={onHide}
                onConfirm={() => onConfirm(tenants)}
                onCancel={onHide}
            />
        );
    }
}
