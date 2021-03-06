// @ts-nocheck File not migrated fully to TS
import _ from 'lodash';
import PropTypes from 'prop-types';
import i18n from 'i18next';
import React, { Component, CSSProperties, FunctionComponent } from 'react';

import { DndContext, closestCenter, PointerSensor } from '@dnd-kit/core';

import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { DragEndEvent, SensorDescriptor } from '@dnd-kit/core';
import { restrictToParentElement } from '@dnd-kit/modifiers';

import Consts from '../../utils/consts';

import {
    ApproveButton,
    Button,
    CancelButton,
    Divider,
    Form,
    Icon,
    List,
    Message,
    Modal,
    Ref,
    Segment
} from '../basic/index';

interface SortablePageItemProps {
    name: string;
    onRemove: () => void;
}
const SortablePageItem: FunctionComponent<SortablePageItemProps> = ({ name, onRemove }) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: name });

    const style: CSSProperties = {
        transform: CSS.Transform.toString(transform),
        transition: transition !== null ? transition : undefined
    };

    return (
        <Ref innerRef={setNodeRef}>
            {/* eslint-disable-next-line react/jsx-props-no-spreading */}
            <List.Item style={style} {...attributes}>
                {name}
                <span className="right floated actionIcons">
                    <Icon
                        link
                        name="minus"
                        onClick={onRemove}
                        title={i18n.t('templates.createTemplateModal.removePage', 'Remove page')}
                    />
                    <Icon
                        // eslint-disable-next-line react/jsx-props-no-spreading
                        {...listeners}
                        link
                        name="move"
                        className="handle"
                        title={i18n.t('templates.createTemplateModal.reorderPage', 'Reorder page')}
                    />
                </span>
            </List.Item>
        </Ref>
    );
};

export default class CreateTemplateModal extends Component {
    static initialState = (open, props) => {
        let availablePages = _.map(props.availablePages, page => page.id);
        availablePages = _.difference(availablePages, props.pages);

        return {
            open,
            loading: false,
            templateName: props.templateName,
            tenants: props.tenants,
            roles: props.roles,
            availablePages,
            pages: props.pages,
            errors: {}
        };
    };

    constructor(props, context) {
        super(props, context);

        this.state = CreateTemplateModal.initialState(false, props);
    }

    openModal = () => {
        this.setState(CreateTemplateModal.initialState(true, this.props));
    };

    submitCreate = () => {
        const { onCreateTemplate } = this.props;
        const { pages, roles, templateName, tenants } = this.state;
        const errors = {};

        if (_.isEmpty(_.trim(templateName))) {
            errors.templateName = i18n.t(
                'templates.createTemplateModal.errors.templateName',
                'Please provide correct template name'
            );
        }

        if (_.isEmpty(roles)) {
            errors.roles = i18n.t('templates.createTemplateModal.errors.role', 'Please select role');
        }

        if (_.isEmpty(tenants)) {
            errors.tenants = i18n.t('templates.createTemplateModal.errors.tenant', 'Please select tenant');
        }

        if (_.isEmpty(pages)) {
            errors.pages = i18n.t('templates.createTemplateModal.errors.page', 'Please select page');
        }

        if (!_.isEmpty(errors)) {
            this.setState({ errors });
            return;
        }

        // Disable the form
        this.setState({ loading: true });

        onCreateTemplate(_.trim(templateName), roles, tenants, pages)
            .then(() => {
                this.setState({ errors: {}, loading: false, open: false });
            })
            .catch(err => {
                this.setState({ errors: { error: err.message }, loading: false });
            });
    };

    handleInputChange = (proxy, field) => {
        if (field.name === 'tenants') {
            const { tenants } = this.state;
            const wasSelectedAll = _.indexOf(tenants, Consts.DEFAULT_ALL) >= 0;
            const willSelectAll = _.indexOf(field.value, Consts.DEFAULT_ALL) >= 0;

            if (wasSelectedAll) {
                _.pull(field.value, Consts.DEFAULT_ALL);
            } else if (willSelectAll) {
                field.value = [Consts.DEFAULT_ALL];
            }
        }

        this.setState(Form.fieldNameValue(field));
    };

    handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (active && over && active.id !== over.id) {
            const { pages } = this.state;
            const oldIndex = pages.indexOf(active.id);
            const newIndex = pages.indexOf(over.id);
            const newPages = [...pages];
            const removed = newPages.splice(oldIndex, 1)[0];

            newPages.splice(newIndex, 0, removed);

            this.setState({ pages: newPages });
        }
    };

    addPage(item) {
        const { availablePages: stateAvailablePages, pages: statePages } = this.state;
        const availablePages = _.without(stateAvailablePages, item);
        const pages = [...statePages, item];

        this.setState({ pages, availablePages });
    }

    removePage(item) {
        const { availablePages: stateAvailablePages, pages: statePages } = this.state;
        const availablePages = [...stateAvailablePages, item];
        const pages = _.without(statePages, item);

        this.setState({ pages, availablePages });
    }

    render() {
        const { availablePages, errors, loading, open, pages, roles, tenants, templateName } = this.state;
        const {
            availableRoles: availableRolesProp,
            availableTenants: availableTenantsProp,
            templateName: templateNameProp
        } = this.props;
        const tenantOptions = _.map(availableTenantsProp.items, item => {
            return { text: item.name, value: item.name };
        });
        tenantOptions.push({ text: 'All tenants', value: Consts.DEFAULT_ALL });

        const rolesOptions = availableRolesProp;

        const editMode = !_.isEmpty(templateNameProp);

        const trigger = editMode ? (
            <Icon name="edit" link className="updateTemplateIcon" onClick={e => e.stopPropagation()} />
        ) : (
            <Button
                content={i18n.t('templates.createTemplateModal.button', 'Create template')}
                icon="list layout"
                labelPosition="left"
                className="createTemplateButton"
            />
        );
        const sensors: SensorDescriptor<any>[] = [
            {
                sensor: PointerSensor,
                options: {}
            }
        ];

        return (
            <Modal
                trigger={trigger}
                open={open}
                onOpen={this.openModal}
                onClose={() => this.setState({ open: false })}
                className="createTemplateModal"
            >
                <Modal.Header>
                    <Icon name="list layout" />{' '}
                    {editMode ? (
                        <span>
                            {i18n.t('templates.createTemplateModal.updateHeader', 'Update template {{templateName}}', {
                                templateName: templateNameProp
                            })}
                        </span>
                    ) : (
                        <span>{i18n.t('templates.createTemplateModal.createHeader', 'Create template')}</span>
                    )}
                </Modal.Header>

                <Modal.Content>
                    <Form loading={loading} errors={errors} onErrorsDismiss={() => this.setState({ errors: {} })}>
                        <Form.Field error={errors.templateName}>
                            <Form.Input
                                name="templateName"
                                placeholder={i18n.t('templates.createTemplateModal.templateName', 'Template name')}
                                value={templateName}
                                onChange={this.handleInputChange}
                            />
                        </Form.Field>

                        <Form.Field error={errors.roles}>
                            <Form.Dropdown
                                placeholder={i18n.t('templates.createTemplateModal.roles', 'Roles')}
                                multiple
                                selection
                                options={rolesOptions}
                                name="roles"
                                value={roles}
                                onChange={this.handleInputChange}
                            />
                        </Form.Field>

                        <Form.Field error={errors.tenants}>
                            <Form.Dropdown
                                placeholder={i18n.t('templates.createTemplateModal.tenants', 'Tenants')}
                                multiple
                                selection
                                options={tenantOptions}
                                name="tenants"
                                value={tenants}
                                onChange={this.handleInputChange}
                            />
                        </Form.Field>

                        <Segment.Group horizontal>
                            <Segment style={{ width: '50%' }}>
                                <Icon name="plus" />
                                {i18n.t('templates.createTemplateModal.availablePages', 'Available pages')}
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
                                                    onClick={() => this.addPage(item)}
                                                    title={i18n.t('templates.createTemplateModal.addPage', 'Add page')}
                                                />
                                            </List.Item>
                                        );
                                    })}

                                    {_.isEmpty(availablePages) && (
                                        <Message
                                            content={i18n.t(
                                                'templates.createTemplateModal.noPagesAvailable',
                                                'No pages available'
                                            )}
                                        />
                                    )}
                                </List>
                            </Segment>

                            <Segment style={{ width: '50%' }}>
                                <Icon name="block layout" />
                                {i18n.t('templates.createTemplateModal.selectedPages', 'Selected pages')}
                                <Divider />
                                <List divided relaxed verticalAlign="middle" className="light" id="reorderList">
                                    <DndContext
                                        sensors={sensors}
                                        collisionDetection={closestCenter}
                                        onDragEnd={this.handleDragEnd}
                                        modifiers={[restrictToParentElement]}
                                    >
                                        <SortableContext items={pages} strategy={verticalListSortingStrategy}>
                                            {pages.map(item => {
                                                return (
                                                    <SortablePageItem
                                                        name={item}
                                                        key={item}
                                                        onRemove={() => this.removePage(item)}
                                                    />
                                                );
                                            })}
                                        </SortableContext>
                                    </DndContext>

                                    {_.isEmpty(pages) && (
                                        <Message
                                            content={i18n.t(
                                                'templates.createTemplateModal.noPagesSelected',
                                                'No pages selected'
                                            )}
                                        />
                                    )}
                                </List>
                            </Segment>
                        </Segment.Group>
                    </Form>
                </Modal.Content>

                <Modal.Actions>
                    <CancelButton onClick={() => this.setState({ open: false })} disabled={loading} />
                    <ApproveButton
                        onClick={this.submitCreate}
                        disabled={loading}
                        content={
                            editMode
                                ? i18n.t('templates.createTemplateModal.update', 'Update')
                                : i18n.t('templates.createTemplateModal.create', 'Create')
                        }
                        icon={editMode ? 'edit' : 'checkmark'}
                        color="green"
                    />
                </Modal.Actions>
            </Modal>
        );
    }
}

CreateTemplateModal.propTypes = {
    availableTenants: PropTypes.shape({}).isRequired,
    // eslint-disable-next-line react/no-unused-prop-types
    availablePages: PropTypes.arrayOf(PropTypes.shape({})),
    availableRoles: PropTypes.arrayOf(PropTypes.shape({})),
    templateName: PropTypes.string,
    // eslint-disable-next-line react/no-unused-prop-types
    pages: PropTypes.arrayOf(PropTypes.string),
    // eslint-disable-next-line react/no-unused-prop-types
    roles: PropTypes.arrayOf(PropTypes.string),
    // eslint-disable-next-line react/no-unused-prop-types
    tenants: PropTypes.arrayOf(PropTypes.string),
    onCreateTemplate: PropTypes.func.isRequired
};

CreateTemplateModal.defaultProps = {
    templateName: '',
    pages: [],
    roles: [],
    tenants: [Consts.DEFAULT_ALL],
    availablePages: [],
    availableRoles: []
};
