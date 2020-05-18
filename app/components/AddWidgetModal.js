/**
 * Created by kinneretzin on 01/09/2016.
 */

import PropTypes from 'prop-types';

import React, { Component } from 'react';
import GenericConfig from '../utils/GenericConfig';
import LoaderUtils from '../utils/LoaderUtils';
import StageUtils from '../utils/stageUtils';
import {
    Button,
    Checkbox,
    Confirm,
    DataTable,
    Divider,
    ErrorMessage,
    Grid,
    Icon,
    Image,
    Input,
    Item,
    Label,
    Menu,
    Modal,
    Segment
} from './basic/index';
import InstallWidgetModal from './InstallWidgetModal';

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
        const { widgetDefinitions } = this.props;
        if (!_.isEqual(prevProps.widgetDefinitions, widgetDefinitions)) {
            this.setState(AddWidgetModal.initialState(this.props));
        }
    }

    openModal() {
        this.setState({ ...AddWidgetModal.initialState(this.props), open: true, widgetsToAdd: [] });
    }

    closeModal() {
        this.setState({ open: false });
    }

    openThumbnailModal(event, widget) {
        event.stopPropagation();
        this.setState({ showThumbnail: true, thumbnailWidget: widget });
    }

    closeThumbnailModal() {
        this.setState({ showThumbnail: false, thumbnailWidget: {} });
    }

    addWidgets() {
        const { onWidgetAdded, widgetDefinitions } = this.props;
        const { widgetsToAdd } = this.state;
        _.forEach(widgetsToAdd, widgetId => {
            const widget = _.find(widgetDefinitions, widgetDefinition => widgetId === widgetDefinition.id);
            if (widget) {
                onWidgetAdded(widget);
            }
        });
        this.setState({ ...this.state, widgetsToAdd: [] });
        this.closeModal();
    }

    toggleWidgetInstall(widgetId) {
        const { widgetsToAdd } = this.state;
        this.setState({
            widgetsToAdd: _.includes(widgetsToAdd, widgetId)
                ? _.without(widgetsToAdd, widgetId)
                : [...widgetsToAdd, widgetId]
        });
    }

    confirmRemove(event, widget) {
        event.stopPropagation();
        const { onWidgetUsed } = this.props;
        onWidgetUsed(widget.id)
            .then(usedByList => {
                this.setState({ widget, usedByList, showConfirm: true });
            })
            .catch(err => {
                this.setState({ error: err.message });
            });
    }

    getWidgetsToAddWithout(widgetId) {
        const { widgetsToAdd } = this.state;
        return _.without(widgetsToAdd, widgetId);
    }

    uninstallWidget() {
        const { onWidgetUninstalled } = this.props;
        const {
            widget: { id: widgetId }
        } = this.state;

        this.setState({ showConfirm: false });
        onWidgetUninstalled(widgetId).then(() =>
            this.setState({ widgetsToAdd: this.getWidgetsToAddWithout(widgetId) })
        );
    }

    updateWidget(widget, widgetFile, widgetUrl) {
        const { onWidgetUpdated } = this.props;
        return onWidgetUpdated(widget.id, widgetFile, widgetUrl).then(() =>
            this.setState({ widgetsToAdd: this.getWidgetsToAddWithout(widget.id) })
        );
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
        const { categories: categoriesFromState } = this.state;
        const categories = categoriesFromState.map(category => {
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

    doFilterWidgets(field, isCategoryChange = false) {
        const { search: stateSearch, selectedCategory } = this.state;
        const search = isCategoryChange ? stateSearch : field.value;
        const category = isCategoryChange ? field.name : selectedCategory;

        const { widgetDefinitions } = this.props;
        let filtered = this.getWidgetsBySearch(widgetDefinitions, search);
        filtered = this.getWidgetsByCategory(filtered, category);

        this.setState({ search, selectedCategory: category, filteredWidgetDefinitions: filtered });
    }

    filterWidgets = (proxy, field) => this.doFilterWidgets(field);

    filterByCategory = (proxy, field) => this.doFilterWidgets(field, true);

    render() {
        const {
            categories,
            error,
            filteredWidgetDefinitions,
            open,
            search,
            selectedCategory,
            showConfirm,
            showThumbnail,
            thumbnailWidget,
            usedByList,
            widget,
            widgetsToAdd
        } = this.state;
        const { canInstallWidgets, className, onWidgetInstalled } = this.props;
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

        const confirmContent = !_.isEmpty(usedByList) ? (
            <Segment basic>
                <h5>Widget is currently used by:</h5>

                <DataTable>
                    <DataTable.Column label="Username" />
                    <DataTable.Column label="Manager IP" />

                    {usedByList.map(item => {
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
                    active={selectedCategory === GenericConfig.CATEGORY.ALL}
                    onClick={this.filterByCategory.bind(this)}
                />

                {categories.map(category => {
                    return (
                        <Menu.Item
                            key={category.name}
                            name={category.name}
                            active={selectedCategory === category.name}
                            onClick={this.filterByCategory.bind(this)}
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
            <div className={className}>
                <Modal
                    trigger={addWidgetBtn}
                    className="addWidgetModal"
                    open={open}
                    closeIcon
                    onOpen={this.openModal.bind(this)}
                    onClose={this.closeModal.bind(this)}
                    size="large"
                >
                    <Segment basic size="large">
                        <ErrorMessage error={error} />

                        <Input
                            icon="search"
                            fluid
                            size="mini"
                            placeholder="Search widgets ..."
                            onChange={this.filterWidgets.bind(this)}
                            value={search}
                        />

                        <Divider />

                        <Grid columns={2}>
                            <Grid.Row>
                                <Grid.Column width={4}>{menuContent}</Grid.Column>
                                <Grid.Column width={12}>
                                    <Item.Group divided className="widgetsList">
                                        {filteredWidgetDefinitions.map(
                                            widget => (
                                                <Item
                                                    key={widget.id}
                                                    data-id={widget.id}
                                                    onClick={() => {
                                                        this.toggleWidgetInstall(widget.id);
                                                    }}
                                                >
                                                    <Checkbox
                                                        className="addWidgetCheckbox"
                                                        readOnly
                                                        title="Add widget to page"
                                                        checked={widgetsToAdd.includes(widget.id)}
                                                    />
                                                    <Item.Image
                                                        as="div"
                                                        size="small"
                                                        bordered
                                                        src={imageSrc(widget)}
                                                        onClick={event => this.openThumbnailModal(event, widget)}
                                                    />
                                                    <Item.Content>
                                                        <Item.Header as="div">{widget.name}</Item.Header>
                                                        <Item.Meta>{widget.description}</Item.Meta>
                                                        <Item.Description />
                                                        <Item.Extra>
                                                            {widget.isCustom && canInstallWidgets && (
                                                                <div>
                                                                    <InstallWidgetModal
                                                                        onWidgetInstalled={this.updateWidget.bind(
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
                                                                        onClick={e => this.confirmRemove(e, widget)}
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

                                        {_.isEmpty(filteredWidgetDefinitions) && (
                                            <Item className="alignCenter" content="No widgets available" />
                                        )}
                                    </Item.Group>

                                    <Button.Group widths="2">
                                        <Button
                                            animated="vertical"
                                            id="addWidgetsBtn"
                                            onClick={() => {
                                                this.addWidgets();
                                            }}
                                            color="green"
                                            disabled={widgetsToAdd.length === 0}
                                        >
                                            <Button.Content visible>
                                                Add selected widgets ({widgetsToAdd.length})
                                            </Button.Content>
                                            <Button.Content hidden>
                                                <Icon name="check" />
                                            </Button.Content>
                                        </Button>

                                        {canInstallWidgets && (
                                            <InstallWidgetModal
                                                onWidgetInstalled={onWidgetInstalled}
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
                    open={showConfirm}
                    onCancel={() => this.setState({ showConfirm: false })}
                    onConfirm={this.uninstallWidget.bind(this)}
                    header={`Are you sure to remove widget ${widget.name}?`}
                    content={confirmContent}
                    className="removeWidgetConfirm"
                />

                <Modal
                    open={showThumbnail}
                    basic
                    closeOnDimmerClick
                    closeOnDocumentClick
                    onClose={this.closeThumbnailModal.bind(this)}
                >
                    <div>
                        <Image centered src={imageSrc(thumbnailWidget)} />
                    </div>
                </Modal>
            </div>
        );
    }
}
