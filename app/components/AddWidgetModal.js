/**
 * Created by kinneretzin on 01/09/2016.
 */

import React, { Component, PropTypes } from 'react';
import {Input, Segment, Divider, Item, Button, DataTable, Modal, Confirm, ErrorMessage, Icon, Checkbox, Grid, Menu, Label} from './basic/index';
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
            usedByList: [],
            categories: AddWidgetModal.generateCategories(props.widgetDefinitions),
            selectedCategory: Stage.GenericConfig.CATEGORY.ALL
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

    static generateCategories(widgets){
        return widgets.reduce((curr,next) => {
                (next.categories || [Stage.GenericConfig.CATEGORY.OTHERS]).map(category => {
                    let idx = curr.findIndex(current => current.name === category);
                    idx === -1 ? curr.push({name: category, count: 1}) : curr[idx].count++;
                });
                return curr
            }, []);
    }

    updateCategoriesCounter(widgets){
        let categories = this.state.categories.map(category => {
            category.count = widgets.filter(widget => 
                (widget.categories || [Stage.GenericConfig.CATEGORY.OTHERS]).indexOf(category.name) !== -1
            ).length
            return category;
        });
        this.setState({categories: categories});
    }

    getWidgetsByCategory(widgets, category){
        let filtered = widgets.filter(item => {
            item.categories = item.categories || [Stage.GenericConfig.CATEGORY.OTHERS];
            return category === Stage.GenericConfig.CATEGORY.ALL || item.categories.indexOf(category) !== -1;
        });
        
        return filtered;
    }

    getWidgetsBySearch(widgets, search){
        let filtered = widgets.filter(
            el => el.name.toLowerCase().includes(search.toLowerCase() || '')
        );
        this.updateCategoriesCounter(filtered)
        return filtered;
    }

    _doFilterWidgets(field, isCategoryChange = false){
        let search = isCategoryChange ? this.state.search : field.value;
        let category = isCategoryChange ? field.name : this.state.selectedCategory;

        let filtered = this.getWidgetsBySearch(this.props.widgetDefinitions, search);
        filtered = this.getWidgetsByCategory(filtered ,category);

        this.setState({search: search, selectedCategory: category, filteredWidgetDefinitions: filtered});
    }

    _filterWidgets = (proxy, field) => this._doFilterWidgets(field);
    _filterByCategory = (proxy, field) => this._doFilterWidgets(field, true);
    
    render() {
        const addWidgetBtn = <Button icon="bar chart" labelPosition='left' basic content='Add Widget' className="addWidgetBtn"/>;

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

        const menuContent = (<Menu fluid vertical tabular>
                                <Menu.Item 
                                    name={Stage.GenericConfig.CATEGORY.ALL}
                                    active={this.state.selectedCategory === Stage.GenericConfig.CATEGORY.ALL}
                                    onClick={this._filterByCategory.bind(this)}/>

                                {this.state.categories.map(category => {
                                    return <Menu.Item 
                                            key={category.name}
                                            name={category.name}
                                            active={this.state.selectedCategory === category.name}
                                            onClick={this._filterByCategory.bind(this)}>
                                                {category.name}
                                                <Label color={category.count ? 'green' : 'yellow'}>{category.count}</Label>
                                            </Menu.Item>
                                })}
                            </Menu>)
        return (
            <div className={this.props.className}>
                <Modal trigger={addWidgetBtn} className="addWidgetModal" open={this.state.open}
                       onOpen={this._openModal.bind(this)} onClose={this._closeModal.bind(this)} size="large">
                    <Segment basic size="large">
                        <ErrorMessage error={this.state.error}/>

                        <Input icon='search' fluid size="mini" placeholder='Search widgets ...'
                               onChange={this._filterWidgets.bind(this)} value={this.state.search}/>
    
                        <Divider/>
                
                <Grid columns={2}>
                    <Grid.Row>
                        <Grid.Column  width={4}>
                            {menuContent}
                        </Grid.Column>
                        <Grid.Column width={12}>

                        <Item.Group divided className="widgetsList">
                            {
                                this.state.filteredWidgetDefinitions.map(function(widget){
                                    return (
                                        <Item key={widget.id} data-id={widget.id} onClick={()=>{this._toggleWidgetInstall(widget)}}>
                                            <Checkbox className="addWidgetCheckbox" readOnly={true} title="Add widget to page" 
                                                      checked={this.state.widgetsToAdd.includes(widget)}/>
                                            <Item.Image as="div" size="small" bordered src={Stage.Utils.url(`/widgets/${widget.id}/widget.png`)}/>
                                            <Item.Content>
                                                <Item.Header as='div'>{widget.name}</Item.Header>
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
                        
                    </Grid.Column>
                    </Grid.Row>
                </Grid>

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
