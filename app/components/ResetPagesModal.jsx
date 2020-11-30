/**
 * Created by aleksander laktionow on 19/10/2017.
 */
import _ from 'lodash';
import log from 'loglevel';
import PropTypes from 'prop-types';
import React from 'react';
import i18n from 'i18next';
import { Modal, Icon, ApproveButton, CancelButton, Checkbox, List, Card, Confirm } from './basic';

export default class ResetPagesModal extends React.Component {
    static initialState = {
        loading: false,
        tenants: [],
        errors: {}
    };

    constructor(props, context) {
        super(props, context);

        this.state = ResetPagesModal.initialState;
        this.state.tenants = props.tenants.items.map(entry => entry.name);
    }

    toggleCheckbox = (event, elem) => {
        const { tenants } = this.state;
        const clickedTenant = elem.name;
        let newTenants = [...tenants];

        if (_.includes(tenants, clickedTenant)) {
            newTenants = _.pull(newTenants, clickedTenant);
        } else {
            newTenants.push(clickedTenant);
        }

        this.setState({ tenants: newTenants }, () => log.error(tenants));
    };

    render() {
        const { loading, tenants } = this.state;
        const { onConfirm, onHide, open } = this.props;
        return tenants.length > 1 ? (
            <Modal className="tiny resetPagesModal" open={open} onClose={onHide}>
                <Modal.Header>
                    <Icon name="user" /> {i18n.t('pagesResetModal.header', 'Reset pages for tenants')}
                </Modal.Header>

                <Modal.Content>
                    {i18n.t(
                        'pagesResetModal.selectTenants',
                        'Please select tenants you would like to reset pages for:'
                    )}
                    <br />
                    <Card fluid>
                        <Card.Content>
                            <List relaxed>
                                {tenants.map(tenant => {
                                    return (
                                        <List.Item key={tenant}>
                                            <Checkbox
                                                name={tenant}
                                                defaultChecked
                                                onChange={this.toggleCheckbox}
                                                label={tenant}
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
                content={i18n.t(
                    'pagesResetModal.confirm',
                    'Are you sure you want to reset application screens to default?'
                )}
                open={open}
                onClose={onHide}
                onConfirm={() => onConfirm(tenants)}
                onCancel={onHide}
            />
        );
    }
}

ResetPagesModal.propTypes = {
    onConfirm: PropTypes.func.isRequired,
    onHide: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    tenants: PropTypes.shape({
        items: PropTypes.arrayOf(PropTypes.shape({ name: PropTypes.string }))
    }).isRequired
};
