import _ from 'lodash';
import React, { FunctionComponent } from 'react';

import { AccordionTitleProps, DropdownProps, ModalProps } from 'semantic-ui-react';
import { useSelector } from 'react-redux';
import Consts from '../../../utils/consts';
import StageUtils from '../../../utils/stageUtils';

import { Accordion, ApproveButton, CancelButton, Divider, Form, Icon, Modal, Segment } from '../../basic';
import { useBoolean, useErrors, useInput, useOpen, useResettableState } from '../../../utils/hooks';
import { ReduxState } from '../../../reducers';
import { PageMenuItem } from './types';
import SelectionList from '../common/SelectionList';
import SortableList from '../common/SortableList';

const t = StageUtils.getT('templates.createTemplateModal');

function toId(item: PageMenuItem) {
    return `${item.type}\n${item.id}`;
}

type AccordionSection = 'pages' | 'pageGroups';

interface CreateTemplateModalProps {
    initialTemplateName: string;
    initialTenants: string[];
    initialRoles: string[];
    initialPageMenuItems: PageMenuItem[];
    trigger: ModalProps['trigger'];
    onCreateTemplate: (
        templateName: string,
        roles: string[],
        tenants: string[],
        selectedPageMenuItems: PageMenuItem[]
    ) => Promise<void>;
}

const CreateTemplateModal: FunctionComponent<CreateTemplateModalProps> = ({
    initialTemplateName = '',
    initialTenants = [Consts.DEFAULT_ALL],
    initialRoles = [],
    initialPageMenuItems = [],
    trigger,
    onCreateTemplate
}) => {
    const allAvailablePages = useSelector((state: ReduxState) => Object.keys(state.templates.pagesDef));
    const allAvailablePageGroups = useSelector((state: ReduxState) => Object.keys(state.templates.pageGroupsDef));
    const allAvailableTenants = useSelector((state: ReduxState) => _.map(state.manager.tenants.items, 'name'));
    const allAvailableRoles = useSelector((state: ReduxState) => state.manager.roles);
    const [loading, setLoading, unsetLoading] = useBoolean();
    const [tenants, setTenants, resetTenants] = useInput(initialTenants);
    const [roles, setRoles, resetRoles] = useInput(initialRoles);
    const [templateName, setTemplateName, resetTemplateName] = useInput(initialTemplateName);
    const { errors, setErrors, clearErrors, setMessageAsError } = useErrors();
    const [selectedPageMenuItems, setSelectedPageMenuItems, resetSelectedPageMenuItems] = useResettableState(
        initialPageMenuItems
    );
    const [expandedAccordions, setExpandedAccordions, resetExpandedAccordions] = useResettableState<
        Record<AccordionSection, boolean>
    >({ pages: false, pageGroups: false });
    const [open, doOpen, doClose] = useOpen(() => {
        resetTenants();
        resetRoles();
        resetTemplateName();
        resetSelectedPageMenuItems();
        resetExpandedAccordions();
    });

    function submitCreate() {
        const submitErrors: {
            templateName?: string;
            roles?: string;
            tenants?: string;
            selectedPageMenuItems?: string;
        } = {};

        if (_.isEmpty(_.trim(templateName))) {
            submitErrors.templateName = t('errors.templateName');
        }

        if (_.isEmpty(roles)) {
            submitErrors.roles = t('errors.role');
        }

        if (_.isEmpty(tenants)) {
            submitErrors.tenants = t('errors.tenant');
        }

        if (_.isEmpty(selectedPageMenuItems)) {
            submitErrors.selectedPageMenuItems = t('errors.pageMenuItem');
        }

        if (!_.isEmpty(submitErrors)) {
            setErrors(submitErrors);
            return;
        }

        // Disable the form
        setLoading();

        onCreateTemplate(_.trim(templateName), roles, tenants, selectedPageMenuItems)
            .then(() => {
                clearErrors();
                doClose();
            })
            .catch(setMessageAsError)
            .finally(unsetLoading);
    }

    function handleTenantsChange(_event: React.SyntheticEvent<HTMLElement>, field: DropdownProps) {
        const newlySelectedTenants = field.value as string[];
        const wasSelectedAll = _.indexOf(tenants, Consts.DEFAULT_ALL) >= 0;
        const willSelectAll = _.indexOf(newlySelectedTenants, Consts.DEFAULT_ALL) >= 0;

        let valueToSet;
        if (wasSelectedAll) {
            valueToSet = _.without(newlySelectedTenants, Consts.DEFAULT_ALL);
        } else if (willSelectAll) {
            valueToSet = [Consts.DEFAULT_ALL];
        } else {
            valueToSet = newlySelectedTenants;
        }

        setTenants(valueToSet);
    }

    function addPage(pageId: string) {
        setSelectedPageMenuItems([...selectedPageMenuItems, { id: pageId, type: 'page' }]);
    }

    function addPageGroup(pageGroupId: string) {
        setSelectedPageMenuItems([...selectedPageMenuItems, { id: pageGroupId, type: 'pageGroup' }]);
    }

    function handleAccordionClick(_event: React.MouseEvent, { index }: AccordionTitleProps) {
        const accordionName = index as AccordionSection;
        setExpandedAccordions({ ...expandedAccordions, [accordionName]: !expandedAccordions[accordionName] });
    }

    const tenantOptions = _.map(allAvailableTenants, item => {
        return { text: item, value: item };
    });
    tenantOptions.push({ text: t('allTenants'), value: Consts.DEFAULT_ALL });

    const editMode = !_.isEmpty(initialTemplateName);

    const availablePages = _(allAvailablePages)
        .difference(_(selectedPageMenuItems).filter({ type: 'page' }).map('id').value())
        .value();
    const availablePageGroups = _(allAvailablePageGroups)
        .difference(_(selectedPageMenuItems).filter({ type: 'pageGroup' }).map('id').value())
        .value();

    return (
        <Modal trigger={trigger} open={open} onOpen={doOpen} onClose={doClose} className="createTemplateModal">
            <Modal.Header>
                <Icon name="list layout" />{' '}
                {editMode ? (
                    <span>
                        {t('updateHeader', {
                            templateName: initialTemplateName
                        })}
                    </span>
                ) : (
                    <span>{t('createHeader')}</span>
                )}
            </Modal.Header>

            <Modal.Content>
                <Form loading={loading} errors={errors} onErrorsDismiss={clearErrors}>
                    <Form.Field error={errors.templateName} label={t('templateName')}>
                        <Form.Input name="templateName" value={templateName} onChange={setTemplateName} />
                    </Form.Field>

                    <Form.Field error={errors.roles} label={t('roles')}>
                        <Form.Dropdown
                            multiple
                            selection
                            options={allAvailableRoles.map(role => ({
                                text: role.description ? `${role.name} - ${role.description}` : role.name,
                                value: role.name
                            }))}
                            name="roles"
                            value={roles}
                            onChange={setRoles}
                        />
                    </Form.Field>

                    <Form.Field error={errors.tenants} label={t('tenants')}>
                        <Form.Dropdown
                            multiple
                            selection
                            options={tenantOptions}
                            name="tenants"
                            value={tenants}
                            onChange={handleTenantsChange}
                        />
                    </Form.Field>

                    <Segment.Group horizontal>
                        <Segment style={{ width: '50%' }}>
                            <Accordion>
                                <Accordion.Title
                                    onClick={handleAccordionClick}
                                    index="pages"
                                    active={expandedAccordions.pages}
                                >
                                    <Icon name="file outline" /> {t('availablePages')}
                                    <Icon name="dropdown" style={{ float: 'right' }} />
                                    <Divider />
                                </Accordion.Title>
                                <Accordion.Content active={expandedAccordions.pages}>
                                    <SelectionList
                                        items={availablePages}
                                        onItemSelected={addPage}
                                        noDataMessageI18nKey="createTemplateModal.noPagesAvailable"
                                        addIconTitleI18nKey="createTemplateModal.addPage"
                                    />
                                </Accordion.Content>
                                <Accordion.Title
                                    onClick={handleAccordionClick}
                                    index="pageGroups"
                                    active={expandedAccordions.pageGroups}
                                >
                                    <Icon name="folder open outline" /> {t('availablePageGroups')}
                                    <Icon name="dropdown" style={{ float: 'right' }} />
                                    <Divider />
                                </Accordion.Title>
                                <Accordion.Content active={expandedAccordions.pageGroups}>
                                    <SelectionList
                                        items={availablePageGroups}
                                        onItemSelected={addPageGroup}
                                        noDataMessageI18nKey="createTemplateModal.noPageGroupsAvailable"
                                        addIconTitleI18nKey="createTemplateModal.addPageGroup"
                                    />
                                </Accordion.Content>
                            </Accordion>
                        </Segment>

                        <SortableList
                            icon="bars"
                            items={selectedPageMenuItems.map(item => ({ item, name: item.id, id: toId(item) }))}
                            titleI18nKey="createTemplateModal.selectedItems"
                            noDataMessageI18nKey="createTemplateModal.noPageMenuItemsSelected"
                            onUpdate={setSelectedPageMenuItems}
                        />
                    </Segment.Group>
                </Form>
            </Modal.Content>

            <Modal.Actions>
                <CancelButton onClick={doClose} disabled={loading} />
                <ApproveButton
                    onClick={submitCreate}
                    disabled={loading}
                    content={editMode ? t('update') : t('create')}
                    icon={editMode ? 'edit' : 'checkmark'}
                    color="green"
                />
            </Modal.Actions>
        </Modal>
    );
};

export default CreateTemplateModal;
