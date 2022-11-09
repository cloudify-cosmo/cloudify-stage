// @ts-nocheck File not migrated fully to TS

import colors from 'cloudify-ui-common-frontend/styles/_colors.scss';
import { LoadingOverlay } from 'cloudify-ui-components';
import i18n from 'i18next';
import { camelCase, find, forEach, includes, isEmpty, isEqual, pick, sortBy, without, wrap } from 'lodash';
import PropTypes from 'prop-types';

import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { updateWidgetDefinition } from '../actions/widgetDefinitions';
import GenericConfig from '../utils/GenericConfig';
import { useBoolean, useResettableState } from '../utils/hooks';
import LoaderUtils from '../utils/LoaderUtils';
import StageUtils from '../utils/stageUtils';
import WidgetDefinitionsLoader from '../utils/widgetDefinitionsLoader';
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
import EditModeButton from './EditModeButton';
import InstallWidgetModal from './InstallWidgetModal';

const AddWidgetModalWrapper = styled.div`
    display: inline-block;
`;

const StyledAddWidgetModal = styled(Modal)`
    max-height: 600px !important;
    padding: 14px;
`;

const WidgetListWrapper = styled.div`
    height: 400px;
    overflow-y: auto;
    margin-bottom: 20px;
`;

const WidgetList = styled(Item.Group)`
    height: 435px;
    padding-top: 5px;

    .selectWidgetButton {
        margin-right: 10px !important;
    }
`;

const AddWidgetCheckBox = styled(Checkbox)`
    margin-left: 10px;
    margin-right: 20px;
    margin-top: auto;
    margin-bottom: auto;
    height: 20px;
`;

const StyledItem = styled(Item)`
    padding: 40px 10px;
    cursor: pointer;
    align-items: center;
    &:hover {
        background-color: ${colors.greyLight};
        border-radius: 5px;
    }
    .image {
        & > img {
            object-fit: contain;
            height: 80px !important;
            border-radius: 5px;
            background: ${colors.white};
            border: 1px dotted ${colors.greyLight};
            transition: all 500ms ease-in-out;
            &:hover {
                transform: scale(1.3);
                box-shadow: 0 8px 20px -6px rgba(0, 0, 0, 0.75);
            }
        }
    }
    .header {
        margin: 0 !important;
    }
`;

let nameIndex = 0;

function generateCategories(widgets) {
    const categories = widgets.reduce((curr, next) => {
        (next.categories || [GenericConfig.CATEGORY.OTHERS]).forEach(category => {
            if (!next.loaded) return;
            const idx = curr.findIndex(current => current.name === category);
            if (idx === -1) {
                curr.push({ name: category, count: 1 });
            } else {
                curr[idx].count += 1;
            }
        });
        return curr;
    }, []);

    return sortBy(categories, 'name');
}

function AddWidgetModal({
    addButtonTitle,
    canInstallWidgets,
    onWidgetInstalled,
    onWidgetAdded,
    onWidgetUsed,
    onWidgetUpdated,
    onWidgetUninstalled,
    widgetDefinitions
}) {
    const [filteredWidgetDefinitions, setFilteredWidgetDefinitions] = useState(widgetDefinitions);
    const [search, setSearch, resetSearch] = useResettableState('');
    const [showConfirm, setShowConfirm, unsetShowConfirm] = useBoolean();
    const [widgetToRemove, setWidgetToRemove, resetWidgetToRemove] = useResettableState({});
    const [showThumbnail, setShowThumbnail, unsetShowThumbnail] = useBoolean();
    const [thumbnailWidget, setThumbnailWidget, resetThumbnailWidget] = useResettableState({});
    const [usedByList, setUsedByList, resetUsedByList] = useResettableState([]);
    const [categories, setCategories] = useState(generateCategories(widgetDefinitions));
    const [selectedCategory, setSelectedCategory] = useState(GenericConfig.CATEGORY.ALL);
    const [widgetsToAdd, setWidgetsToAdd, resetWidgetsToAdd] = useResettableState([]);
    const [open, setOpen, unsetOpen] = useBoolean();
    const [error, setError] = useState();
    const dispatch = useDispatch();

    function resetInternalState() {
        setFilteredWidgetDefinitions(widgetDefinitions);
        resetSearch();
        unsetShowConfirm();
        resetWidgetToRemove();
        unsetShowThumbnail();
        resetThumbnailWidget();
        resetUsedByList();
        setCategories(generateCategories(widgetDefinitions));
        setSelectedCategory(GenericConfig.CATEGORY.ALL);
    }

    useEffect(resetInternalState, [JSON.stringify(widgetDefinitions)]);

    useEffect(
        () =>
            widgetDefinitions.forEach(widgetDefinition => {
                if (!widgetDefinition.loaded) {
                    WidgetDefinitionsLoader.loadWidget(widgetDefinition).then(loadedWidgetDefinition =>
                        dispatch(updateWidgetDefinition(widgetDefinition.id, loadedWidgetDefinition))
                    );
                }
            }),
        []
    );

    function openModal() {
        resetInternalState();
        setOpen();
        resetWidgetsToAdd();
    }

    function closeModal() {
        unsetOpen();
    }

    function openThumbnailModal(event, widget) {
        event.stopPropagation();
        setShowThumbnail();
        setThumbnailWidget(widget);
    }

    function closeThumbnailModal() {
        unsetShowThumbnail();
        resetThumbnailWidget();
    }

    function addWidgets() {
        forEach(widgetsToAdd, widgetId => {
            const widget = find(widgetDefinitions, widgetDefinition => widgetId === widgetDefinition.id);
            if (widget) {
                onWidgetAdded(
                    widget.name ||
                        i18n.t('editMode.addWidget.defaultWidgetName', `Widget_{{index}}`, { index: nameIndex }),
                    widget
                );
                nameIndex += 1;
            }
        });
        resetWidgetsToAdd();
        closeModal();
    }

    function toggleWidgetInstall(widgetId) {
        setWidgetsToAdd(
            includes(widgetsToAdd, widgetId) ? without(widgetsToAdd, widgetId) : [...widgetsToAdd, widgetId]
        );
    }

    function confirmRemove(event, widget) {
        onWidgetUsed(widget.id)
            .then(widgetUsedByList => {
                setWidgetToRemove(widget);
                setUsedByList(widgetUsedByList);
                setShowConfirm();
            })
            .catch(err => {
                setError(err.message);
            });
    }

    function getWidgetsToAddWithout(widgetId) {
        return without(widgetsToAdd, widgetId);
    }

    function uninstallWidget() {
        unsetShowConfirm();
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
            content={i18n.t('editMode.addWidget.addButton', 'Add Widget')}
            className="addWidgetBtn"
            style={{ marginBottom: 15, marginLeft: 1, marginTop: 1 }}
            title={addButtonTitle}
        />
    );

    const installWidgetBtn = (
        <Button animated="vertical" id="installWidgetBtn" onClick={() => {}}>
            <Button.Content visible>{i18n.t('editMode.addWidget.installButton', 'Install new widget')}</Button.Content>
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
            content={i18n.t('editMode.addWidget.updateButton', 'Update')}
            className="updateWidgetButton"
        />
    );

    const confirmContent = !isEmpty(usedByList) ? (
        <Segment basic>
            <h5>{i18n.t('editMode.removeWidget.usedBy.header', 'Widget is currently used by:')}</h5>

            <DataTable>
                <DataTable.Column label={i18n.t('editMode.removeWidget.usedBy.username', 'Username')} />
                <DataTable.Column label={i18n.t('editMode.removeWidget.usedBy.manager', 'Manager IP')} />

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
                name={i18n.t('editMode.addWidget.category.all')}
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
                        {i18n.t(`editMode.addWidget.category.${camelCase(category.name)}`)}
                        <Label color={category.count ? 'green' : 'yellow'}>{category.count}</Label>
                    </Menu.Item>
                );
            })}
        </Menu>
    );

    const imageSrc = widget =>
        StageUtils.Url.url(LoaderUtils.getResourceUrl(`widgets/${widget.id}/widget.png`, widget.isCustom));

    return (
        <AddWidgetModalWrapper>
            <StyledAddWidgetModal
                trigger={addWidgetBtn}
                open={open}
                closeIcon
                onOpen={openModal}
                onClose={closeModal}
                size="large"
            >
                <ErrorMessage error={error} />

                <Input
                    icon="search"
                    fluid
                    size="mini"
                    placeholder={i18n.t('editMode.addWidget.search', 'Search widgets ...')}
                    onChange={filterWidgets}
                    value={search}
                />

                <Divider />

                <Grid columns={2}>
                    <Grid.Row>
                        <Grid.Column width={4}>{menuContent}</Grid.Column>
                        <Grid.Column width={12}>
                            <WidgetListWrapper>
                                <WidgetList divided>
                                    {find(widgetDefinitions, { loaded: false }) && <LoadingOverlay />}
                                    {filteredWidgetDefinitions.map(
                                        widget => (
                                            <StyledItem
                                                key={widget.id}
                                                data-id={widget.id}
                                                onClick={() => {
                                                    toggleWidgetInstall(widget.id);
                                                }}
                                            >
                                                <AddWidgetCheckBox
                                                    readOnly
                                                    title={i18n.t('editMode.addWidget.checkbox', 'Add widget to page')}
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
                                                            // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions
                                                            <div onClick={e => e.stopPropagation()}>
                                                                <InstallWidgetModal
                                                                    onWidgetInstalled={wrap(widget, updateWidget)}
                                                                    trigger={updateWidgetBtn}
                                                                    buttonLabel={i18n.t(
                                                                        'editMode.addWidget.updateModal.button',
                                                                        'Update Widget'
                                                                    )}
                                                                    className="updateWidgetModal"
                                                                    header={i18n.t(
                                                                        'editMode.addWidget.updateModal.header',
                                                                        'Update widget definition'
                                                                    )}
                                                                />

                                                                <Button
                                                                    floated="left"
                                                                    size="small"
                                                                    compact
                                                                    basic
                                                                    content={i18n.t(
                                                                        'editMode.removeWidget.button',
                                                                        'Remove'
                                                                    )}
                                                                    onClick={e => confirmRemove(e, widget)}
                                                                    className="removeWidgetButton"
                                                                />
                                                            </div>
                                                        )}
                                                    </Item.Extra>
                                                </Item.Content>
                                            </StyledItem>
                                        ),
                                        this
                                    )}

                                    {isEmpty(filteredWidgetDefinitions) && (
                                        <Item
                                            className="alignCenter"
                                            content={i18n.t('editMode.addWidget.noWidgets', 'No widgets available')}
                                        />
                                    )}
                                </WidgetList>
                            </WidgetListWrapper>
                            <Button.Group widths="2">
                                <Button
                                    animated="vertical"
                                    id="addWidgetsBtn"
                                    onClick={addWidgets}
                                    color="green"
                                    disabled={widgetsToAdd.length === 0}
                                >
                                    <Button.Content visible>
                                        {i18n.t(
                                            'editMode.addWidget.submitButton',
                                            'Add selected widgets ({{widgetsCount}})',
                                            { widgetsCount: widgetsToAdd.length }
                                        )}
                                    </Button.Content>
                                    <Button.Content hidden>
                                        <Icon name="check" />
                                    </Button.Content>
                                </Button>

                                {canInstallWidgets && (
                                    <InstallWidgetModal
                                        onWidgetInstalled={onWidgetInstalled}
                                        trigger={installWidgetBtn}
                                        header={i18n.t('editMode.addWidget.installModal.header', 'Install new widget')}
                                        buttonLabel={i18n.t(
                                            'editMode.addWidget.installModal.submitButton',
                                            'Install Widget'
                                        )}
                                    />
                                )}
                            </Button.Group>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </StyledAddWidgetModal>

            <Confirm
                open={showConfirm}
                onCancel={unsetShowConfirm}
                onConfirm={uninstallWidget}
                header={i18n.t(
                    'editMode.removeWidget.confirm',
                    `Are you sure to remove widget {{name}}`,
                    pick(widgetToRemove, 'name')
                )}
                content={confirmContent}
                className="removeWidgetConfirm"
            />

            <Modal open={showThumbnail} basic closeOnDimmerClick closeOnDocumentClick onClose={closeThumbnailModal}>
                <div>
                    <Image centered src={imageSrc(thumbnailWidget)} />
                </div>
            </Modal>
        </AddWidgetModalWrapper>
    );
}

AddWidgetModal.propTypes = {
    addButtonTitle: PropTypes.string,
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

AddWidgetModal.defaultProps = {
    addButtonTitle: null
};

// NOTE: AddWidgetModal is not exported directly from this file and cannot be used as a type in the emitted declarations
/** @type {import('react').ComponentType<import('prop-types').InferProps<typeof AddWidgetModal['propTypes']>>} */
const MemoizedAddWidgetModal = React.memo(AddWidgetModal, isEqual);
export default MemoizedAddWidgetModal;
