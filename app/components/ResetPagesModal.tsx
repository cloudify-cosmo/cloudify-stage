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
    tenantNames: string[];
}

interface ResetPagesModalState {
    loading: boolean;
    /**
     * NOTE: by storing the unselected tenant names, the newly added tenants will automatically
     * appear as selected.
     *
     * This is compared to the solution of storing selected tenant names, in which newly added
     * tenants will remain not selected, unless some non-trivial additional logic is added to add
     * them automatically.
     */
    unselectedTenantNames: Set<string>;
}

export default class ResetPagesModal extends React.Component<ResetPagesModalProps, ResetPagesModalState> {
    constructor(props: ResetPagesModalProps) {
        super(props);

        this.state = {
            loading: false,
            unselectedTenantNames: new Set()
        };
    }

    private toggleCheckbox: CheckboxProps['onChange'] = (_event, elem) => {
        const { unselectedTenantNames } = this.state;
        // NOTE: tenant names are always defined
        const clickedTenant = elem.name!;
        const newUnselectedTenantNames = new Set(unselectedTenantNames);

        if (unselectedTenantNames.has(clickedTenant)) {
            newUnselectedTenantNames.delete(clickedTenant);
        } else {
            newUnselectedTenantNames.add(clickedTenant);
        }

        this.setState({ unselectedTenantNames: newUnselectedTenantNames }, () =>
            log.debug('Updated tenants', this.getSelectedTenants())
        );
    };

    private getSelectedTenants = () => {
        const { tenantNames } = this.props;
        const { unselectedTenantNames } = this.state;

        return tenantNames.filter(name => !unselectedTenantNames.has(name));
    };

    render() {
        const { loading, unselectedTenantNames } = this.state;
        const { onConfirm, onHide, open, tenantNames } = this.props;
        const noTenantsSelected = unselectedTenantNames.size === tenantNames.length;

        return tenantNames.length > 1 ? (
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
                                {tenantNames.map(tenantName => {
                                    return (
                                        <List.Item key={tenantName}>
                                            <Checkbox
                                                name={tenantName}
                                                checked={!unselectedTenantNames.has(tenantName)}
                                                onChange={this.toggleCheckbox}
                                                label={tenantName}
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
                        onClick={() => onConfirm(this.getSelectedTenants())}
                        disabled={loading || noTenantsSelected}
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
                onConfirm={() => onConfirm(this.getSelectedTenants())}
                onCancel={onHide}
            />
        );
    }
}
