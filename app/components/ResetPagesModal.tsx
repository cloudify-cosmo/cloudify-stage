import _ from 'lodash';
import log from 'loglevel';
import React from 'react';
import i18n from 'i18next';
import { CheckboxProps } from 'semantic-ui-react';

import { Modal, Icon, ApproveButton, CancelButton, Checkbox, List, Card, Confirm } from './basic';

export interface ResetPagesModalProps {
    onConfirm: (tenantsNamesToReset: string[]) => void;
    onHide: () => void;
    open: boolean;
    tenants: {
        items: { name: string }[];
    };
}

interface ResetPagesModalState {
    loading: boolean;
    tenants: string[];
}

export default class ResetPagesModal extends React.Component<ResetPagesModalProps, ResetPagesModalState> {
    constructor(props: ResetPagesModalProps) {
        super(props);

        this.state = {
            loading: false,
            tenants: props.tenants.items.map(entry => entry.name)
        };
    }

    toggleCheckbox: CheckboxProps['onChange'] = (_event, elem) => {
        const { tenants } = this.state;
        // NOTE: tenant names are always defined
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const clickedTenant = elem.name!;
        let newTenants = [...tenants];

        if (tenants.includes(clickedTenant)) {
            newTenants = tenants.filter(tenant => tenant !== clickedTenant);
        } else {
            newTenants.push(clickedTenant);
        }

        this.setState({ tenants: newTenants }, () => log.debug('Updated tenants', tenants));
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
