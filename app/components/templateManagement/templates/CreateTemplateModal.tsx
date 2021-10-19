import _ from 'lodash';
import React, { CSSProperties, FunctionComponent } from 'react';

import type { DragEndEvent, SensorDescriptor } from '@dnd-kit/core';
import { closestCenter, DndContext, PointerSensor } from '@dnd-kit/core';

import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { restrictToParentElement } from '@dnd-kit/modifiers';

import { DropdownProps, ModalProps } from 'semantic-ui-react';
import { useSelector } from 'react-redux';
import Consts from '../../../utils/consts';
import StageUtils from '../../../utils/stageUtils';

import {
    ApproveButton,
    CancelButton,
    Divider,
    Form,
    Icon,
    List,
    Message,
    Modal,
    Ref,
    Segment,
    UnsafelyTypedFormField
} from '../../basic';
import { useBoolean, useErrors, useInput, useOpen, useResettableState } from '../../../utils/hooks';
import { ReduxState } from '../../../reducers';

const t = StageUtils.getT('templates.createTemplateModal');

interface PageMenuItem {
    id: string;
    type: 'page' | 'pageGroup';
}

function toId(item: PageMenuItem) {
    return `${item.type}\n${item.id}`;
}

interface SortablePageItemProps {
    item: PageMenuItem;
    onRemove: () => void;
}

const SortablePageItem: FunctionComponent<SortablePageItemProps> = ({ item, onRemove }) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
        id: toId(item),
        data: { item }
    });

    const style: CSSProperties = {
        transform: CSS.Transform.toString(transform),
        transition: transition !== null ? transition : undefined
    };

    return (
        <Ref innerRef={setNodeRef}>
            {/* eslint-disable-next-line react/jsx-props-no-spreading */}
            <List.Item style={style} {...attributes}>
                {item.id}
                <span className="right floated actionIcons">
                    <Icon link name="minus" onClick={onRemove} title={t('removePage')} />
                    <Icon
                        // eslint-disable-next-line react/jsx-props-no-spreading
                        {...listeners}
                        link
                        name="move"
                        className="handle"
                        title={t('reorderPage')}
                    />
                </span>
            </List.Item>
        </Ref>
    );
};

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
    const [open, doOpen, doClose] = useOpen(() => {
        resetTenants();
        resetRoles();
        resetTemplateName();
        resetSelectedPageMenuItems();
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

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;
        if (active && over && active.id !== over.id) {
            const oldIndex = selectedPageMenuItems.indexOf(active.data.current?.item);
            const newIndex = selectedPageMenuItems.indexOf(over.data.current?.item);

            const newSelectedPageMenuItems = [...selectedPageMenuItems];
            const removed = newSelectedPageMenuItems.splice(oldIndex, 1)[0];
            newSelectedPageMenuItems.splice(newIndex, 0, removed);

            setSelectedPageMenuItems(newSelectedPageMenuItems);
        }
    }

    function addPage(pageId: string) {
        setSelectedPageMenuItems([...selectedPageMenuItems, { id: pageId, type: 'page' }]);
    }

    function addPageGroup(pageGroupId: string) {
        setSelectedPageMenuItems([...selectedPageMenuItems, { id: pageGroupId, type: 'pageGroup' }]);
    }

    function removePageMenuItem(item: PageMenuItem) {
        setSelectedPageMenuItems(_.reject(selectedPageMenuItems, item));
    }

    const tenantOptions = _.map(allAvailableTenants, item => {
        return { text: item, value: item };
    });
    tenantOptions.push({ text: 'All tenants', value: Consts.DEFAULT_ALL });

    const editMode = !_.isEmpty(initialTemplateName);

    const sensors: SensorDescriptor<any>[] = [
        {
            sensor: PointerSensor,
            options: {}
        }
    ];

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
                    <UnsafelyTypedFormField error={errors.templateName}>
                        <Form.Input
                            name="templateName"
                            placeholder={t('templateName')}
                            value={templateName}
                            onChange={setTemplateName}
                        />
                    </UnsafelyTypedFormField>

                    <UnsafelyTypedFormField error={errors.roles}>
                        <Form.Dropdown
                            placeholder={t('roles')}
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
                    </UnsafelyTypedFormField>

                    <UnsafelyTypedFormField error={errors.tenants}>
                        <Form.Dropdown
                            placeholder={t('tenants')}
                            multiple
                            selection
                            options={tenantOptions}
                            name="tenants"
                            value={tenants}
                            onChange={handleTenantsChange}
                        />
                    </UnsafelyTypedFormField>

                    <Segment.Group horizontal>
                        <Segment style={{ width: '50%' }}>
                            <Icon name="plus" />
                            {t('availablePages')}
                            <Divider />
                            <List divided relaxed verticalAlign="middle" className="light">
                                {availablePages.map(item => {
                                    return (
                                        <List.Item key={item}>
                                            {item}

                                            <Icon
                                                link
                                                name="add"
                                                className="right floated"
                                                onClick={() => addPage(item)}
                                                title={t('addPage')}
                                            />
                                        </List.Item>
                                    );
                                })}

                                {_.isEmpty(availablePages) && (
                                    <Message content={t('noPagesAvailable', 'No pages available')} />
                                )}
                            </List>
                            <Icon name="plus" />
                            {t('availablePageGroups')}
                            <Divider />
                            <List divided relaxed verticalAlign="middle" className="light">
                                {availablePageGroups.map(item => {
                                    return (
                                        <List.Item key={item}>
                                            {item}

                                            <Icon
                                                link
                                                name="add"
                                                className="right floated"
                                                onClick={() => addPageGroup(item)}
                                                title={t('addPageGroup')}
                                            />
                                        </List.Item>
                                    );
                                })}

                                {_.isEmpty(availablePageGroups) && <Message content={t('noPageGroupsAvailable')} />}
                            </List>
                        </Segment>

                        <Segment style={{ width: '50%' }}>
                            <Icon name="block layout" />
                            {t('selectedItems')}
                            <Divider />
                            <List divided relaxed verticalAlign="middle" className="light" id="reorderList">
                                <DndContext
                                    sensors={sensors}
                                    collisionDetection={closestCenter}
                                    onDragEnd={handleDragEnd}
                                    modifiers={[restrictToParentElement]}
                                >
                                    <SortableContext
                                        items={selectedPageMenuItems.map(toId)}
                                        strategy={verticalListSortingStrategy}
                                    >
                                        {selectedPageMenuItems.map(item => {
                                            return (
                                                <SortablePageItem
                                                    item={item}
                                                    key={toId(item)}
                                                    onRemove={() => removePageMenuItem(item)}
                                                />
                                            );
                                        })}
                                    </SortableContext>
                                </DndContext>

                                {_.isEmpty(selectedPageMenuItems) && <Message content={t('noPageMenuItemsSelected')} />}
                            </List>
                        </Segment>
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
