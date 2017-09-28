/**
 * Created by pposel on 22/08/2017.
 */
import React, { Component, PropTypes } from 'react';
import Consts from '../../utils/consts';

export default class CreateTemplateModal extends React.Component {

    constructor(props,context) {
        super(props,context);

        this.state = CreateTemplateModal.initialState(false, props);
    }

    static initialState = (open, props) => {
        var availablePages = _.map(props.availablePages, page => page.id);
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
        }
    };

    static propTypes = {
        availableTenants: PropTypes.object,
        availablePages: PropTypes.array,
        availableRoles: PropTypes.array,
        templateName: PropTypes.string,
        pages: PropTypes.array,
        roles: PropTypes.array,
        tenants: PropTypes.array,
        onCreateTemplate: PropTypes.func.isRequired
    };

    static defaultProps = {
        templateName: '',
        pages: [],
        roles: [],
        tenants: [],
        availablePages: [],
        availableRoles: []
    };

    componentDidUpdate() {
        if (!$('#reorderList').hasClass( 'ui-sortable' )) {
            $('#reorderList').sortable({
                placeholder: 'ui-sortable-placeholder',
                helper: 'clone',
                handle: '.handle',
                forcePlaceholderSize: true,
                start: (event, ui)=>this.pageIndex = ui.item.index(),
                update: (event, ui)=>this._reorderPage(this.pageIndex, ui.item.index())
            });
        }
    }

    _openModal() {
        this.setState(CreateTemplateModal.initialState(true, this.props))
    }

    _reorderPage(oldIndex, newIndex) {
        var pages = this.state.pages;

        var removed = pages.splice(oldIndex, 1)[0];
        pages.splice(newIndex, 0, removed);

        this.setState({pages});
    }

    _submitCreate() {
        let errors = {};

        if (_.isEmpty(this.state.templateName)) {
            errors['templateName']='Please provide template name';
        }

        if (_.isEmpty(this.state.roles)) {
            errors['roles']='Please select role';
        }

        if (_.isEmpty(this.state.pages)) {
            errors['pages']='Please select page';
        }

        if (!_.isEmpty(errors)) {
            this.setState({errors});
            return false;
        }

        // Disable the form
        this.setState({loading: true});

        this.props.onCreateTemplate(this.state.templateName, this.state.roles, this.state.tenants, this.state.pages).then(()=>{
            this.setState({errors: {}, loading: false, open: false});
        }).catch((err)=>{
            this.setState({errors: {error: err.message}, loading: false});
        });
    }

    _handleInputChange(proxy, field) {
        this.setState(Stage.Basic.Form.fieldNameValue(field));
    }

    _addPage(item) {
        var availablePages = _.without(this.state.availablePages, item);
        var pages = [...this.state.pages, item];

        this.setState({pages, availablePages}, () => {
            $('#reorderList').sortable('refresh');
        });
    }

    _removePage(item) {
        var availablePages = [...this.state.availablePages, item];
        var pages = _.without(this.state.pages, item);

        this.setState({pages, availablePages}, () => {
            $('#reorderList').sortable('refresh');
        });
    }

    render() {
        var {Modal, Button, Icon, Form, Segment, ApproveButton, CancelButton, Message, Divider, List} = Stage.Basic;

        let tenantOptions = _.map(this.props.availableTenants.items,item => {return {text: item.name, value: item.name}});

        let editMode = !_.isEmpty(this.props.templateName);

        const trigger = editMode ?
            <Icon name="edit" link  className='updateTemplateIcon' onClick={e => e.stopPropagation()}/>
            :
            <Button content='Create template' icon='list layout' labelPosition='left' className='createTemplateButton'/>;

        return (
            <Modal trigger={trigger} open={this.state.open} onOpen={this._openModal.bind(this)}
                   onClose={()=>this.setState({open:false})} className="createTemplateModal">
                <Modal.Header>
                    <Icon name="list layout"/> {editMode ? <span>Update template {this.props.templateName}</span> : <span>Create template</span>}
                </Modal.Header>

                <Modal.Content>
                    <Form loading={this.state.loading} errors={this.state.errors} onErrorsDismiss={() => this.setState({errors: {}})}>
                        <Form.Field error={this.state.errors.templateName}>
                            <Form.Input name='templateName' placeholder="Template name"
                                        value={this.state.templateName} onChange={this._handleInputChange.bind(this)}/>
                        </Form.Field>

                        <Form.Field error={this.state.errors.roles}>
                            <Form.Dropdown placeholder='Roles' multiple selection closeOnChange options={this.props.availableRoles} name="roles"
                                           value={this.state.roles} onChange={this._handleInputChange.bind(this)}/>
                        </Form.Field>

                        <Form.Field error={this.state.errors.tenants}>
                            <Form.Dropdown placeholder='Tenants' multiple selection closeOnChange options={tenantOptions} name="tenants"
                                           value={this.state.tenants} onChange={this._handleInputChange.bind(this)}/>
                        </Form.Field>

                        <Segment.Group horizontal>
                            <Segment style={{width: '50%'}}>
                                <Icon name="plus"/> Available pages
                                <Divider/>
                                <List divided relaxed verticalAlign='middle' className="light">
                                    {
                                        this.state.availablePages.map((item) => {
                                            return (
                                                <List.Item key={item}>
                                                    {item}

                                                    <Icon link name='add' className="right floated" onClick={this._addPage.bind(this, item)} title="Add page"/>
                                                </List.Item>
                                            );
                                        })
                                    }

                                    {_.isEmpty(this.state.availablePages) && <Message content="No pages available"/>}
                                </List>
                            </Segment>

                            <Segment style={{width: '50%'}}>
                                <Icon name="block layout"/> Selected pages
                                <Divider/>
                                <List divided relaxed verticalAlign='middle' className="light" id="reorderList">
                                    {
                                        this.state.pages.map((item) => {
                                            return (
                                                <List.Item key={item}>
                                                    {item}

                                                    <span className="right floated actionIcons">
                                                        <Icon link name='minus' onClick={this._removePage.bind(this, item)} title="Remove page"/>
                                                        <Icon link name='move' className="handle" title="Reorder page"/>
                                                    </span>
                                                </List.Item>
                                            );
                                        })
                                    }

                                    {_.isEmpty(this.state.pages) && <Message content="No pages selected"/>}
                                </List>
                            </Segment>
                        </Segment.Group>
                    </Form>
                </Modal.Content>

                <Modal.Actions>
                    <CancelButton onClick={()=>this.setState({open:false})} disabled={this.state.loading} />
                    <ApproveButton onClick={this._submitCreate.bind(this)} disabled={this.state.loading} content={editMode ? 'Update' : 'Create'}
                                   icon={editMode ? 'edit' : 'checkmark'} color="green"/>
                </Modal.Actions>
            </Modal>
        );
    }
};
