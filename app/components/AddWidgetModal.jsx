/**
 * Created by kinneretzin on 01/09/2016.
 */

import PropTypes from 'prop-types';

import React, { useEffect, useState } from 'react';
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
import EditModeButton from './EditModeButton';

let nameIndex = 0;

function generateCategories(widgets) {
    const categories = widgets.reduce((curr, next) => {
        (next.categories || [GenericConfig.CATEGORY.OTHERS]).forEach(category => {
            const idx = curr.findIndex(current => current.name === category);
            if (idx === -1) {
                curr.push({ name: category, count: 1 });
            } else {
                curr[idx].count += 1;
            }
        });
        return curr;
    }, []);

    return _.sortBy(categories, 'name');
}

function AddWidgetModal({
    canInstallWidgets,
    onWidgetInstalled,
    onWidgetAdded,
    onWidgetUsed,
    onWidgetUpdated,
    onWidgetUninstalled,
    widgetDefinitions
}) {
    const [filteredWidgetDefinitions, setFilteredWidgetDefinitions] = useState(widgetDefinitions);
    const [search, setSearch] = useState('');
    const [showConfirm, setShowConfirm] = useState(false);
    const [widgetToRemove, setWidgetToRemove] = useState({});
    const [showThumbnail, setShowThumbnail] = useState(false);
    const [thumbnailWidget, setThumbnailWidget] = useState({});
    const [usedByList, setUsedByList] = useState([]);
    const [categories, setCategories] = useState(generateCategories(widgetDefinitions));
    const [selectedCategory, setSelectedCategory] = useState(GenericConfig.CATEGORY.ALL);
    const [widgetsToAdd, setWidgetsToAdd] = useState([]);
    const [open, setOpen] = useState(false);
    const [error, setError] = useState();

    function resetInternalState() {
        setFilteredWidgetDefinitions(widgetDefinitions);
        setSearch('');
        setShowConfirm(false);
        setWidgetToRemove({});
        setShowThumbnail(false);
        setThumbnailWidget({});
        setUsedByList([]);
        setCategories(generateCategories(widgetDefinitions));
        setSelectedCategory(GenericConfig.CATEGORY.ALL);
    }

    useEffect(resetInternalState, [JSON.stringify(widgetDefinitions)]);

    function openModal() {
        resetInternalState();
        setOpen(true);
        setWidgetsToAdd([]);
    }

    function closeModal() {
        setOpen(false);
    }

    function openThumbnailModal(event, widget) {
        event.stopPropagation();
        setShowThumbnail(true);
        setThumbnailWidget(widget);
    }

    function closeThumbnailModal() {
        setShowThumbnail(false);
        setThumbnailWidget({});
    }

    function addWidgets() {
        _.forEach(widgetsToAdd, widgetId => {
            const widget = _.find(widgetDefinitions, widgetDefinition => widgetId === widgetDefinition.id);
            if (widget) {
                onWidgetAdded(widget.name || `Widget_${nameIndex}`, widget);
                nameIndex += 1;
            }
        });
        setWidgetsToAdd([]);
        closeModal();
    }

    function toggleWidgetInstall(widgetId) {
        setWidgetsToAdd(
            _.includes(widgetsToAdd, widgetId) ? _.without(widgetsToAdd, widgetId) : [...widgetsToAdd, widgetId]
        );
    }

    function confirmRemove(event, widget) {
        onWidgetUsed(widget.id)
            .then(widgetUsedByList => {
                setWidgetToRemove(widget);
                setUsedByList(widgetUsedByList);
                setShowConfirm(true);
            })
            .catch(err => {
                setError(err.message);
            });
    }

    function getWidgetsToAddWithout(widgetId) {
        return _.without(widgetsToAdd, widgetId);
    }

    function uninstallWidget() {
        setShowConfirm(false);
        onWidgetUninstalled(widgetToRemove.id).then(() => setWidgetsToAdd(getWidgetsToAddWithout(widgetToRemove.id)));
    }

    function updateWidget(widget, widgetFile, widgetUrl) {
        return onWidgetUpdated(widget.id, widgetFile, widgetUrl).then(() =>
            setWidgetsToAdd(getWidgetsToAddWithout(widget.id))
        );
    }

    function updateCategoriesCounter(widgets) {
        setCategories(
            categories.map(category => {
                category.count = widgets.filter(
                    widget => (widget.categories || [GenericConfig.CATEGORY.OTHERS]).indexOf(category.name) !== -1
                ).length;
                return category;
            })
        );
    }

    function getWidgetsByCategory(widgets, category) {
        const filtered = widgets.filter(item => {
            item.categories = item.categories || [GenericConfig.CATEGORY.OTHERS];
            return category === GenericConfig.CATEGORY.ALL || item.categories.indexOf(category) !== -1;
        });

        return filtered;
    }

    function getWidgetsBySearch(widgets, searchText) {
        const filtered = widgets.filter(el => el.name.toLowerCase().includes(searchText.toLowerCase() || ''));
        updateCategoriesCounter(filtered);
        return filtered;
    }

    function doFilterWidgets(field, isCategoryChange = false) {
        const updatedSearch = isCategoryChange ? search : field.value;
        const category = isCategoryChange ? field.name : selectedCategory;

        let filtered = getWidgetsBySearch(widgetDefinitions, updatedSearch);
        filtered = getWidgetsByCategory(filtered, category);

        setSearch(updatedSearch);
        setSelectedCategory(category);
        setFilteredWidgetDefinitions(filtered);
    }

    const filterWidgets = (proxy, field) => doFilterWidgets(field);

    const filterByCategory = (proxy, field) => doFilterWidgets(field, true);

    const addWidgetBtn = (
        <EditModeButton
            icon="add"
            labelPosition="left"
            content="Add Widget"
            className="addWidgetBtn"
            style={{ marginBottom: 15 }}
        />
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
        <Button floated="left" size="small" compact basic content="Update" className="updateWidgetButton" />
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
                onClick={filterByCategory}
            />

            {categories.map(category => {
                return (
                    <Menu.Item
                        key={category.name}
                        name={category.name}
                        active={selectedCategory === category.name}
                        onClick={filterByCategory}
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
        <div style={{ display: 'inline-block' }}>
            <Modal
                trigger={addWidgetBtn}
                className="addWidgetModal"
                open={open}
                closeIcon
                onOpen={openModal}
                onClose={closeModal}
                size="large"
            >
                <Segment basic size="large">
                    <ErrorMessage error={error} />

                    <Input
                        icon="search"
                        fluid
                        size="mini"
                        placeholder="Search widgets ..."
                        onChange={filterWidgets}
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
                                                    toggleWidgetInstall(widget.id);
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
                                                    onClick={event => openThumbnailModal(event, widget)}
                                                />
                                                <Item.Content>
                                                    <Item.Header as="div">{widget.name}</Item.Header>
                                                    <Item.Meta>{widget.description}</Item.Meta>
                                                    <Item.Description />
                                                    <Item.Extra>
                                                        {widget.isCustom && canInstallWidgets && (
                                                            <div>
                                                                <InstallWidgetModal
                                                                    onWidgetInstalled={_.wrap(widget, updateWidget)}
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
                                                                    onClick={e => confirmRemove(e, widget)}
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
                                        onClick={addWidgets}
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
                onCancel={() => setShowConfirm(false)}
                onConfirm={uninstallWidget}
                header={`Are you sure to remove widget ${widgetToRemove.name}?`}
                content={confirmContent}
                className="removeWidgetConfirm"
            />

            <Modal open={showThumbnail} basic closeOnDimmerClick closeOnDocumentClick onClose={closeThumbnailModal}>
                <div>
                    <Image centered src={imageSrc(thumbnailWidget)} />
                </div>
            </Modal>
        </div>
    );
}

AddWidgetModal.propTypes = {
    canInstallWidgets: PropTypes.bool.isRequired,
    widgetDefinitions: PropTypes.arrayOf(
        PropTypes.shape({
            description: PropTypes.string,
            id: PropTypes.string,
            isCustom: PropTypes.bool,
            name: PropTypes.string
        })
    ).isRequired,
    onWidgetAdded: PropTypes.func.isRequired,
    onWidgetInstalled: PropTypes.func.isRequired,
    onWidgetUninstalled: PropTypes.func.isRequired,
    onWidgetUpdated: PropTypes.func.isRequired,
    onWidgetUsed: PropTypes.func.isRequired
};

export default React.memo(AddWidgetModal, _.isEqual);
