/**
 * Created by kinneretzin on 01/09/2016.
 */

import PropTypes from 'prop-types';

import React, { Component } from 'react';
import {
    Input,
    Segment,
    Divider,
    Item,
    Image,
    Button,
    DataTable,
    Modal,
    Confirm,
    ErrorMessage,
    Icon,
    Checkbox,
    Grid,
    Menu,
    Label
} from './basic/index';
import InstallWidgetModal from './InstallWidgetModal';
import GenericConfig from '../utils/GenericConfig';
import LoaderUtils from '../utils/LoaderUtils';
import StageUtils from '../utils/stageUtils';

export default class AddWidgetModal extends Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            ...AddWidgetModal.initialState(props),
            open: false,
            widgetsToAdd: []
        };
    }

    static initialState = props => {
        return {
            filteredWidgetDefinitions: props.widgetDefinitions,
            search: '',
            showConfirm: false,
            widget: {},
            showThumbnail: false,
            thumbnailWidget: {},
            usedByList: [],
            categories: AddWidgetModal.generateCategories(props.widgetDefinitions),
            selectedCategory: GenericConfig.CATEGORY.ALL
        };
    };

    static propTypes = {
        widgetDefinitions: PropTypes.array.isRequired,
        onWidgetAdded: PropTypes.func.isRequired,
        onWidgetInstalled: PropTypes.func.isRequired,
        onWidgetUninstalled: PropTypes.func.isRequired,
        onWidgetUpdated: PropTypes.func.isRequired,
        onWidgetUsed: PropTypes.func.isRequired
    };

    componentDidUpdate(prevProps) {
        if (!_.isEqual(prevProps.widgetDefinitions, this.props.widgetDefinitions)) {
            this.setState(AddWidgetModal.initialState(this.props));
        }
    }

    _openModal() {
        this.setState({ ...AddWidgetModal.initialState(this.props), open: true, widgetsToAdd: [] });
    }

    _closeModal() {
        this.setState({ open: false });
    }

    _openThumbnailModal(event, widget) {
        event.stopPropagation();
        this.setState({ showThumbnail: true, thumbnailWidget: widget });
    }

    _closeThumbnailModal() {
        this.setState({ showThumbnail: false, thumbnailWidget: {} });
    }

    _addWidgets() {
        _.forEach(this.state.widgetsToAdd, widgetId => {
            const widget = _.find(this.props.widgetDefinitions, widgetDefinition => widgetId === widgetDefinition.id);
            if (widget) {
                this.props.onWidgetAdded(widget);
            }
        });
        this.setState({ ...this.state, widgetsToAdd: [] });
        this._closeModal();
    }

    _toggleWidgetInstall(widgetId) {
        this.setState({
            widgetsToAdd: _.includes(this.state.widgetsToAdd, widgetId)
                ? _.without(this.state.widgetsToAdd, widgetId)
                : [...this.state.widgetsToAdd, widgetId]
        });
    }

    _confirmRemove(event, widget) {
        event.stopPropagation();
        this.props
            .onWidgetUsed(widget.id)
            .then(usedByList => {
                this.setState({ widget, usedByList, showConfirm: true });
            })
            .catch(err => {
                this.setState({ error: err.message });
            });
    }

    _getWidgetsToAddWithout(widgetId) {
        return _.without(this.state.widgetsToAdd, widgetId);
    }

    _uninstallWidget() {
        const widgetId = this.state.widget.id;

        this.setState({ showConfirm: false });
        this.props
            .onWidgetUninstalled(widgetId)
            .then(() => this.setState({ widgetsToAdd: this._getWidgetsToAddWithout(widgetId) }));
    }

    _updateWidget(widget, widgetFile, widgetUrl) {
        return this.props
            .onWidgetUpdated(widget.id, widgetFile, widgetUrl)
            .then(() => this.setState({ widgetsToAdd: this._getWidgetsToAddWithout(widget.id) }));
    }

    static generateCategories(widgets) {
        const categories = widgets.reduce((curr, next) => {
            (next.categories || [GenericConfig.CATEGORY.OTHERS]).map(category => {
                const idx = curr.findIndex(current => current.name === category);
                idx === -1 ? curr.push({ name: category, count: 1 }) : curr[idx].count++;
            });
            return curr;
        }, []);

        return _.sortBy(categories, 'name');
    }

    updateCategoriesCounter(widgets) {
        const categories = this.state.categories.map(category => {
            category.count = widgets.filter(
                widget => (widget.categories || [GenericConfig.CATEGORY.OTHERS]).indexOf(category.name) !== -1
            ).length;
            return category;
        });
        this.setState({ categories });
    }

    getWidgetsByCategory(widgets, category) {
        const filtered = widgets.filter(item => {
            item.categories = item.categories || [GenericConfig.CATEGORY.OTHERS];
            return category === GenericConfig.CATEGORY.ALL || item.categories.indexOf(category) !== -1;
        });

        return filtered;
    }

    getWidgetsBySearch(widgets, search) {
        const filtered = widgets.filter(el => el.name.toLowerCase().includes(search.toLowerCase() || ''));
        this.updateCategoriesCounter(filtered);
        return filtered;
    }

    _doFilterWidgets(field, isCategoryChange = false) {
        const search = isCategoryChange ? this.state.search : field.value;
        const category = isCategoryChange ? field.name : this.state.selectedCategory;

        let filtered = this.getWidgetsBySearch(this.props.widgetDefinitions, search);
        filtered = this.getWidgetsByCategory(filtered, category);

        this.setState({ search, selectedCategory: category, filteredWidgetDefinitions: filtered });
    }

    _filterWidgets = (proxy, field) => this._doFilterWidgets(field);

    _filterByCategory = (proxy, field) => this._doFilterWidgets(field, true);

    render() {
        const addWidgetBtn = (
            <Button icon="bar chart" labelPosition="left" basic content="Add Widget" className="addWidgetBtn" />
        );

        const installWidgetBtn = (
            <Button animated="vertical" id="installWidgetBtn" onClick={() => {}}>
                <Button.Content visible>Install new widget</Button.Content>
                <Button.Content hidden>
                    <Icon name="folder open" />
                </Button.Content>
            </Button>
        );
        const updateWidgetBtn = (
            <Button
                floated="left"
                size="small"
                compact
                basic
                content="Update"
                className="updateWidgetButton"
                onClick={e => e.stopPropagation()}
            />
        );

        const confirmContent = !_.isEmpty(this.state.usedByList) ? (
            <Segment basic>
                <h5>Widget is currently used by:</h5>

                <DataTable>
                    <DataTable.Column label="Username" />
                    <DataTable.Column label="Manager IP" />

                    {this.state.usedByList.map(item => {
                        return (
                            <DataTable.Row key={item.username + item.managerIp}>
                                <DataTable.Data>{item.username}</DataTable.Data>
                                <DataTable.Data>{item.managerIp}</DataTable.Data>
                            </DataTable.Row>
                        );
                    })}
                </DataTable>
            </Segment>
        ) : (
            ''
        );

        const menuContent = (
            <Menu fluid vertical tabular>
                <Menu.Item
                    name={GenericConfig.CATEGORY.ALL}
                    active={this.state.selectedCategory === GenericConfig.CATEGORY.ALL}
                    onClick={this._filterByCategory.bind(this)}
                />

                {this.state.categories.map(category => {
                    return (
                        <Menu.Item
                            key={category.name}
                            name={category.name}
                            active={this.state.selectedCategory === category.name}
                            onClick={this._filterByCategory.bind(this)}
                        >
                            {category.name}
                            <Label color={category.count ? 'green' : 'yellow'}>{category.count}</Label>
                        </Menu.Item>
                    );
                })}
            </Menu>
        );

        const imageSrc = widget =>
            StageUtils.Url.url(LoaderUtils.getResourceUrl(`widgets/${widget.id}/widget.png`, widget.isCustom));

        return (
            <div className={this.props.className}>
                <Modal
                    trigger={addWidgetBtn}
                    className="addWidgetModal"
                    open={this.state.open}
                    closeIcon
                    onOpen={this._openModal.bind(this)}
                    onClose={this._closeModal.bind(this)}
                    size="large"
                >
                    <Segment basic size="large">
                        <ErrorMessage error={this.state.error} />

                        <Input
                            icon="search"
                            fluid
                            size="mini"
                            placeholder="Search widgets ..."
                            onChange={this._filterWidgets.bind(this)}
                            value={this.state.search}
                        />

                        <Divider />

                        <Grid columns={2}>
                            <Grid.Row>
                                <Grid.Column width={4}>{menuContent}</Grid.Column>
                                <Grid.Column width={12}>
                                    <Item.Group divided className="widgetsList">
                                        {this.state.filteredWidgetDefinitions.map(
                                            widget => (
                                                <Item
                                                    key={widget.id}
                                                    data-id={widget.id}
                                                    onClick={() => {
                                                        this._toggleWidgetInstall(widget.id);
                                                    }}
                                                >
                                                    <Checkbox
                                                        className="addWidgetCheckbox"
                                                        readOnly
                                                        title="Add widget to page"
                                                        checked={this.state.widgetsToAdd.includes(widget.id)}
                                                    />
                                                    <Item.Image
                                                        as="div"
                                                        size="small"
                                                        bordered
                                                        src={imageSrc(widget)}
                                                        onClick={event => this._openThumbnailModal(event, widget)}
                                                    />
                                                    <Item.Content>
                                                        <Item.Header as="div">{widget.name}</Item.Header>
                                                        <Item.Meta>{widget.description}</Item.Meta>
                                                        <Item.Description />
                                                        <Item.Extra>
                                                            {widget.isCustom && this.props.canInstallWidgets && (
                                                                <div>
                                                                    <InstallWidgetModal
                                                                        onWidgetInstalled={this._updateWidget.bind(
                                                                            this,
                                                                            widget
                                                                        )}
                                                                        trigger={updateWidgetBtn}
                                                                        buttonLabel="Update Widget"
                                                                        className="updateWidgetModal"
                                                                        header="Update widget definition"
                                                                    />

                                                                    <Button
                                                                        floated="left"
                                                                        size="small"
                                                                        compact
                                                                        basic
                                                                        content="Remove"
                                                                        onClick={e => this._confirmRemove(e, widget)}
                                                                        className="removeWidgetButton"
                                                                    />
                                                                </div>
                                                            )}
                                                        </Item.Extra>
                                                    </Item.Content>
                                                </Item>
                                            ),
                                            this
                                        )}

                                        {_.isEmpty(this.state.filteredWidgetDefinitions) && (
                                            <Item className="alignCenter" content="No widgets available" />
                                        )}
                                    </Item.Group>

                                    <Button.Group widths="2">
                                        <Button
                                            animated="vertical"
                                            id="addWidgetsBtn"
                                            onClick={() => {
                                                this._addWidgets();
                                            }}
                                            color="green"
                                            disabled={this.state.widgetsToAdd.length === 0}
                                        >
                                            <Button.Content visible>
                                                Add selected widgets ({this.state.widgetsToAdd.length})
                                            </Button.Content>
                                            <Button.Content hidden>
                                                <Icon name="check" />
                                            </Button.Content>
                                        </Button>

                                        {this.props.canInstallWidgets && (
                                            <InstallWidgetModal
                                                onWidgetInstalled={this.props.onWidgetInstalled}
                                                trigger={installWidgetBtn}
                                                header="Install new widget"
                                                buttonLabel="Install Widget"
                                            />
                                        )}
                                    </Button.Group>
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </Segment>
                </Modal>

                <Confirm
                    open={this.state.showConfirm}
                    onCancel={() => this.setState({ showConfirm: false })}
                    onConfirm={this._uninstallWidget.bind(this)}
                    header={`Are you sure to remove widget ${this.state.widget.name}?`}
                    content={confirmContent}
                    className="removeWidgetConfirm"
                />

                <Modal
                    open={this.state.showThumbnail}
                    basic
                    closeOnDimmerClick
                    closeOnDocumentClick
                    onClose={this._closeThumbnailModal.bind(this)}
                >
                    <div>
                        <Image centered src={imageSrc(this.state.thumbnailWidget)} />
                    </div>
                </Modal>
            </div>
        );
    }
}
