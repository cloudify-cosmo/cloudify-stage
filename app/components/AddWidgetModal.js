/**
 * Created by kinneretzin on 01/09/2016.
 */

import React, { Component, PropTypes } from 'react';
import {Input, Segment, Divider, Item, Button, DataTable, Modal, Confirm, ErrorMessage, Icon, Checkbox} from './basic/index';
import InstallWidgetModal from './InstallWidgetModal';

export default class AddWidgetModal extends Component {

    constructor(props,context){
        super(props, context);

        this.state = {
            ...AddWidgetModal.initialState(props),
            open: false,
            widgetsToAdd: []
        };
    }

    static initialState = (props) => {
        return {
            filteredWidgetDefinitions: props.widgetDefinitions,
            search: '',
            showConfirm : false,
            widget: {},
            usedByList: []
        }
    };

    static propTypes = {
        widgetDefinitions: PropTypes.array.isRequired,
        onWidgetAdded: PropTypes.func.isRequired,
        onWidgetInstalled: PropTypes.func.isRequired,
        onWidgetUninstalled: PropTypes.func.isRequired,
        onWidgetUpdated: PropTypes.func.isRequired,
        onWidgetUsed: PropTypes.func.isRequired
    };

    componentWillReceiveProps(nextProps) {
        if (!_.isEqual(this.props.widgetDefinitions, nextProps.widgetDefinitions)) {
            this.setState(AddWidgetModal.initialState(nextProps))
        }
    }

    _openModal() {
        this.setState({...AddWidgetModal.initialState(this.props), open: true});
    }

    _closeModal() {
        this.setState({open: false});
    }

    _addWidgets() {
        this.state.widgetsToAdd.forEach(widget => {this.props.onWidgetAdded(widget)});
        this.setState({...this.state, widgetsToAdd: []});
        this._closeModal();
    }

    _toggleWidgetInstall(widget) {
        let index = this.state.widgetsToAdd.indexOf(widget);
        if (index > -1){
            this.state.widgetsToAdd.splice(index, 1);
            this.setState({widgetsToAdd: this.state.widgetsToAdd});
        } else {
            var updatedWidgetsToAdd = this.state.widgetsToAdd;
            updatedWidgetsToAdd.push(widget);
            this.setState({widgetsToAdd: updatedWidgetsToAdd});
        }
    }

    _confirmRemove(event, widget) {
        event.stopPropagation();
        this.props.onWidgetUsed(widget.id).then(usedByList => {
            this.setState({widget, usedByList, showConfirm:true})
        }).catch(err => {
            this.setState({error: err.message});
        });
    }

    _uninstallWidget() {
        this.setState({showConfirm:false});
        this.props.onWidgetUninstalled(this.state.widget.id);
    }

    _updateWidget(widget, widgetFile, widgetUrl) {
        return this.props.onWidgetUpdated(widget.id, widgetFile, widgetUrl);
    }

    _filterWidgets(proxy, field) {
        var filtered = this.props.widgetDefinitions.filter(
            el=>el.name.toLowerCase().includes(field.value.toLowerCase() || '')
        );

        this.setState({search: field.value, filteredWidgetDefinitions: filtered});
    }

    render() {
        const addWidgetBtn = <Button labelPosition='left' icon="plus" size="tiny" color="teal"
                                        basic content='Add Widget' className="addWidgetBtn"/>;

        const installWidgetBtn = <Button animated="vertical" id="installWidgetBtn" onClick={()=> {}}>
                                    <Button.Content visible>Install new widget</Button.Content>
                                    <Button.Content hidden>
                                        <Icon name="folder open" />
                                    </Button.Content>
                                </Button>;

        const updateWidgetBtn = <Button floated='left' size="small" compact basic content="Update"
                                        className="updateWidgetButton"
                                        onClick={(e) => e.stopPropagation()}/>;

        const confirmContent = !_.isEmpty(this.state.usedByList) ?
            (<Segment basic>
                <h5>Widget is currently used by:</h5>

                <DataTable>
                <DataTable.Column label="Username"/>
                <DataTable.Column label="Manager IP"/>

                {
                    this.state.usedByList.map((item) => {
                        return (
                            <DataTable.Row key={item.username + item.managerIp}>
                                <DataTable.Data>{item.username}</DataTable.Data>
                                <DataTable.Data>{item.managerIp}</DataTable.Data>
                            </DataTable.Row>
                        );
                    }
                )}
            </DataTable></Segment>) : '';

        return (
            <div>
                <Modal trigger={addWidgetBtn} className="addWidgetModal" open={this.state.open}
                       onOpen={this._openModal.bind(this)} onClose={this._closeModal.bind(this)}>
                    <Segment basic size="large">
                        <ErrorMessage error={this.state.error}/>

                        <Input icon='search' fluid size="mini" placeholder='Search widgets ...'
                               onChange={this._filterWidgets.bind(this)} value={this.state.search}/>
    
                        <Divider/>
    
                        <Item.Group divided className="widgetsList">
                            {
                                this.state.filteredWidgetDefinitions.map(function(widget){
                                    return (
                                        <Item key={widget.id} data-id={widget.id} onClick={()=>{this._toggleWidgetInstall(widget)}}>
                                            <Checkbox className="addWidgetCheckbox" readOnly={true} title="Add widget to page"
                                                      checked={this.state.widgetsToAdd.includes(widget)}/>
                                            <Item.Image as="div" size="small" bordered src={`/widgets/${widget.id}/widget.png`}/>
                                            <Item.Content>
                                                <Item.Header as='a'>{widget.name}</Item.Header>
                                                <Item.Meta>{widget.description}</Item.Meta>
                                                <Item.Description></Item.Description>
                                                <Item.Extra>
                                                    {widget.isCustom &&
                                                        <div>
                                                            <InstallWidgetModal onWidgetInstalled={this._updateWidget.bind(this,widget)}
                                                                                trigger={updateWidgetBtn} buttonLabel="Update Widget"
                                                                                header="Update widget definition"/>

                                                            <Button floated='left' size="small" compact basic content="Remove"
                                                                    onClick={(e) => this._confirmRemove(e, widget)} className="removeWidgetButton"/>
                                                        </div>
                                                    }
                                                </Item.Extra>
                                            </Item.Content>
                                        </Item>
                                    );
                                },this)
                            }

                            {_.isEmpty(this.state.filteredWidgetDefinitions) && <Item className="alignCenter" content="No widgets available"/>}
                        </Item.Group>

                        <Button.Group widths='2'>
                            <Button animated="vertical" id="addWidgetsBtn" onClick={() => {this._addWidgets()}} color="green"
                                    disabled={this.state.widgetsToAdd.length === 0}>
                                <Button.Content visible>Add selected widgets ({this.state.widgetsToAdd.length})</Button.Content>
                                <Button.Content hidden>
                                    <Icon name="check" />
                                </Button.Content>
                            </Button>


                            <InstallWidgetModal onWidgetInstalled={this.props.onWidgetInstalled} trigger={installWidgetBtn}
                                                header="Install new widget" buttonLabel="Install Widget"/>
                        </Button.Group>
                    </Segment>
                </Modal>

                <Confirm open={this.state.showConfirm}
                         onCancel={()=>this.setState({showConfirm:false})}
                         onConfirm={this._uninstallWidget.bind(this)}
                         header={`Are you sure to remove widget ${this.state.widget.name}?`}
                         content={confirmContent} className="removeWidgetConfirm"/>

            </div>
        );
    }
}
