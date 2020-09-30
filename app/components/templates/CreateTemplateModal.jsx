/**
 * Created by pposel on 22/08/2017.
 */
import PropTypes from 'prop-types';

import React, { Component } from 'react';
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
    Segment
} from '../basic/index';

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

    componentDidUpdate() {
        if (!$('#reorderList').hasClass('ui-sortable')) {
            $('#reorderList').sortable({
                placeholder: 'ui-sortable-placeholder',
                helper: 'clone',
                handle: '.handle',
                forcePlaceholderSize: true,
                start: (event, ui) => (this.pageIndex = ui.item.index()),
                update: (event, ui) => this.reorderPage(this.pageIndex, ui.item.index())
            });
        }
    }

    openModal = () => {
        this.setState(CreateTemplateModal.initialState(true, this.props));
    };

    submitCreate = () => {
        const { onCreateTemplate } = this.props;
        const { pages, roles, templateName, tenants } = this.state;
        const errors = {};

        if (_.isEmpty(_.trim(templateName))) {
            errors.templateName = 'Please provide correct template name';
        }

        if (_.isEmpty(roles)) {
            errors.roles = 'Please select role';
        }

        if (_.isEmpty(tenants)) {
            errors.tenants = 'Please select tenant';
        }

        if (_.isEmpty(pages)) {
            errors.pages = 'Please select page';
        }

        if (!_.isEmpty(errors)) {
            this.setState({ errors });
            return false;
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

    reorderPage(oldIndex, newIndex) {
        const { pages } = this.state;

        const removed = pages.splice(oldIndex, 1)[0];
        pages.splice(newIndex, 0, removed);

        this.setState({ pages });
    }

    addPage(item) {
        const { availablePages: stateAvailablePages, pages: statePages } = this.state;
        const availablePages = _.without(stateAvailablePages, item);
        const pages = [...statePages, item];

        this.setState({ pages, availablePages }, () => {
            $('#reorderList').sortable('refresh');
        });
    }

    removePage(item) {
        const { availablePages: stateAvailablePages, pages: statePages } = this.state;
        const availablePages = [...stateAvailablePages, item];
        const pages = _.without(statePages, item);

        this.setState({ pages, availablePages }, () => {
            $('#reorderList').sortable('refresh');
        });
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
                content="Create template"
                icon="list layout"
                labelPosition="left"
                className="createTemplateButton"
            />
        );

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
                    {editMode ? <span>Update template {templateNameProp}</span> : <span>Create template</span>}
                </Modal.Header>

                <Modal.Content>
                    <Form loading={loading} errors={errors} onErrorsDismiss={() => this.setState({ errors: {} })}>
                        <Form.Field error={errors.templateName}>
                            <Form.Input
                                name="templateName"
                                placeholder="Template name"
                                value={templateName}
                                onChange={this.handleInputChange}
                            />
                        </Form.Field>

                        <Form.Field error={errors.roles}>
                            <Form.Dropdown
                                placeholder="Roles"
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
                                placeholder="Tenants"
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
                                <Icon name="plus" /> Available pages
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
                                                    title="Add page"
                                                />
                                            </List.Item>
                                        );
                                    })}

                                    {_.isEmpty(availablePages) && <Message content="No pages available" />}
                                </List>
                            </Segment>

                            <Segment style={{ width: '50%' }}>
                                <Icon name="block layout" /> Selected pages
                                <Divider />
                                <List divided relaxed verticalAlign="middle" className="light" id="reorderList">
                                    {pages.map(item => {
                                        return (
                                            <List.Item key={item}>
                                                {item}

                                                <span className="right floated actionIcons">
                                                    <Icon
                                                        link
                                                        name="minus"
                                                        onClick={() => this.removePage(item)}
                                                        title="Remove page"
                                                    />
                                                    <Icon link name="move" className="handle" title="Reorder page" />
                                                </span>
                                            </List.Item>
                                        );
                                    })}

                                    {_.isEmpty(pages) && <Message content="No pages selected" />}
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
                        content={editMode ? 'Update' : 'Create'}
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
