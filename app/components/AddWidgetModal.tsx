import colors from 'cloudify-ui-common-frontend/styles/_colors.scss';
import { LoadingOverlay } from 'cloudify-ui-components';
import i18n from 'i18next';
import { camelCase, find, forEach, includes, isEmpty, isEqual, pick, sortBy, without, wrap } from 'lodash';
import type { InputOnChangeData, MenuItemProps, StrictInputProps, StrictMenuItemProps } from 'semantic-ui-react';

import { connect, useDispatch } from 'react-redux';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import type { GetWidgetsUsedResponse } from 'backend/routes/Widgets.types';
import type { EnhancedWidgetDefinition } from '../actions/widgetDefinitions';
import {
    checkIfWidgetIsUsed,
    installWidget,
    replaceWidget,
    uninstallWidget,
    updateWidgetDefinition
} from '../actions/widgetDefinitions';
import Consts from '../utils/consts';
import type { ReduxState } from '../reducers';
import type { ReduxThunkDispatch } from '../configureStore';
import type GenericConfigType from '../utils/GenericConfig';
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
import type { ObjectKeys } from '../utils/types';

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

type Category = ObjectKeys<typeof GenericConfigType['CATEGORY']>;
interface CategoryCount {
    name: Category;
    count: number;
}
function generateCategories(widgets: EnhancedWidgetDefinition[]) {
    const categories = widgets.reduce((result: CategoryCount[], next) => {
        (next.categories || [GenericConfig.CATEGORY.OTHERS]).forEach(category => {
            if (!next.loaded) return;
            const idx = result.findIndex(current => current.name === category);
            if (idx === -1) {
                result.push({ name: category, count: 1 });
            } else {
                result[idx].count += 1;
            }
        });
        return result;
    }, []);

    return sortBy(categories, 'name');
}

export interface AddWidgetModalProps {
    addButtonTitle: string;
    canInstallWidgets: boolean;
    widgetDefinitions: EnhancedWidgetDefinition[];
    onWidgetAdded: (widgetId: string, widgetDefinition: EnhancedWidgetDefinition) => any;
    onWidgetInstalled: (widgetFile: File | null, widgetUrl: string) => any;
    onWidgetUninstalled: (widgetId: string) => any;
    onWidgetUpdated: (widgetId: string, widgetFile: File | null, widgetUrl: string) => any;
    onWidgetUsed: (widgetId: string) => Promise<GetWidgetsUsedResponse>;
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
}: AddWidgetModalProps) {
    const [filteredWidgetDefinitions, setFilteredWidgetDefinitions] =
        useState<EnhancedWidgetDefinition[]>(widgetDefinitions);
    const [search, setSearch, resetSearch] = useResettableState('');
    const [showConfirm, setShowConfirm, unsetShowConfirm] = useBoolean();
    const [widgetToRemove, setWidgetToRemove, resetWidgetToRemove] =
        useResettableState<EnhancedWidgetDefinition | null>(null);
    const [showThumbnail, setShowThumbnail, unsetShowThumbnail] = useBoolean();
    const [thumbnailWidget, setThumbnailWidget, resetThumbnailWidget] =
        useResettableState<EnhancedWidgetDefinition | null>(null);
    const [usedByList, setUsedByList, resetUsedByList] = useResettableState<GetWidgetsUsedResponse>([]);
    const [categories, setCategories] = useState(generateCategories(widgetDefinitions));
    const [selectedCategory, setSelectedCategory] = useState<Category>(GenericConfig.CATEGORY.ALL);
    const [widgetsToAdd, setWidgetsToAdd, resetWidgetsToAdd] = useResettableState<string[]>([]);
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
                    WidgetDefinitionsLoader.loadWidget(widgetDefinition).then(loadedWidgetDefinition => {
                        if (loadedWidgetDefinition)
                            dispatch(updateWidgetDefinition(widgetDefinition.id, loadedWidgetDefinition));
                    });
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

    function openThumbnailModal(event: Event, widget: EnhancedWidgetDefinition) {
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

    function toggleWidgetInstall(widgetId: string) {
        setWidgetsToAdd(
            includes(widgetsToAdd, widgetId) ? without(widgetsToAdd, widgetId) : [...widgetsToAdd, widgetId]
        );
    }

    function confirmRemove(_event: React.MouseEvent, widget: EnhancedWidgetDefinition) {
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

    function getWidgetsToAddWithout(widgetId: string) {
        return without(widgetsToAdd, widgetId);
    }

    function doUninstallWidget() {
        unsetShowConfirm();
        if (widgetToRemove) {
            onWidgetUninstalled(widgetToRemove.id).then(() =>
                setWidgetsToAdd(getWidgetsToAddWithout(widgetToRemove.id))
            );
        }
    }

    function updateWidget(widget: EnhancedWidgetDefinition, widgetFile: File | null, widgetUrl: string) {
        return onWidgetUpdated(widget.id, widgetFile, widgetUrl).then(() =>
            setWidgetsToAdd(getWidgetsToAddWithout(widget.id))
        );
    }

    function updateCategoriesCounter(widgets: EnhancedWidgetDefinition[]) {
        setCategories(
            categories.map(category => {
                category.count = widgets.filter(
                    widget => (widget.categories || [GenericConfig.CATEGORY.OTHERS]).indexOf(category.name) !== -1
                ).length;
                return category;
            })
        );
    }

    function getWidgetsByCategory(widgets: EnhancedWidgetDefinition[], category: Category) {
        const filtered = widgets.filter(widget => {
            widget.categories = widget.categories || [GenericConfig.CATEGORY.OTHERS];
            return category === GenericConfig.CATEGORY.ALL || widget.categories.indexOf(category) !== -1;
        });

        return filtered;
    }

    function getWidgetsBySearch(widgets: EnhancedWidgetDefinition[], searchText: string) {
        const filtered = widgets.filter(el => el.name.toLowerCase().includes(searchText.toLowerCase() || ''));
        updateCategoriesCounter(filtered);
        return filtered;
    }

    function doFilterWidgets(field: InputOnChangeData | MenuItemProps) {
        let updatedSearch = '';
        let category: Category = GenericConfig.CATEGORY.ALL;
        if ('value' in field) {
            updatedSearch = field.value;
            category = selectedCategory;
        } else {
            updatedSearch = search;
            category = field.name;
        }

        let filtered = getWidgetsBySearch(widgetDefinitions, updatedSearch);
        filtered = getWidgetsByCategory(filtered, category);

        setSearch(updatedSearch);
        setSelectedCategory(category);
        setFilteredWidgetDefinitions(filtered);
    }

    const filterWidgets: StrictInputProps['onChange'] = (_event, data) => doFilterWidgets(data);

    const filterByCategory: StrictMenuItemProps['onClick'] = (_event, data) => doFilterWidgets(data);

    const addWidgetBtn = (
        <EditModeButton
            icon="add"
            labelPosition="left"
            content={i18n.t('editMode.addWidget.addButton')}
            className="addWidgetBtn"
            style={{ marginBottom: 15, marginLeft: 1, marginTop: 1 }}
            title={addButtonTitle}
        />
    );

    const installWidgetBtn = (
        <Button animated="vertical" id="installWidgetBtn" onClick={() => {}}>
            <Button.Content visible>{i18n.t('editMode.addWidget.installButton')}</Button.Content>
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
            content={i18n.t('editMode.addWidget.updateButton')}
            className="updateWidgetButton"
        />
    );

    const confirmContent = !isEmpty(usedByList) ? (
        <Segment basic>
            <h5>{i18n.t('editMode.removeWidget.usedBy.header')}</h5>

            <DataTable>
                <DataTable.Column label={i18n.t('editMode.removeWidget.usedBy.username')} />
                <DataTable.Column label={i18n.t('editMode.removeWidget.usedBy.manager')} />

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

    const imageSrc = (widget: EnhancedWidgetDefinition) =>
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
                    placeholder={i18n.t('editMode.addWidget.search')}
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
                                    {filteredWidgetDefinitions.map(widget => (
                                        <StyledItem
                                            key={widget.id}
                                            data-id={widget.id}
                                            onClick={() => {
                                                toggleWidgetInstall(widget.id);
                                            }}
                                        >
                                            <AddWidgetCheckBox
                                                readOnly
                                                title={i18n.t('editMode.addWidget.checkbox')}
                                                checked={widgetsToAdd.includes(widget.id)}
                                            />
                                            <Item.Image
                                                as="div"
                                                size="small"
                                                bordered
                                                src={imageSrc(widget)}
                                                onClick={(event: Event) => openThumbnailModal(event, widget)}
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
                                                                /* @ts-ignore InstallWidgetModal not migrated yet */
                                                                onWidgetInstalled={wrap(widget, updateWidget)}
                                                                trigger={updateWidgetBtn}
                                                                buttonLabel={i18n.t(
                                                                    'editMode.addWidget.updateModal.button'
                                                                )}
                                                                className="updateWidgetModal"
                                                                header={i18n.t('editMode.addWidget.updateModal.header')}
                                                            />

                                                            <Button
                                                                floated="left"
                                                                size="small"
                                                                compact
                                                                basic
                                                                content={i18n.t('editMode.removeWidget.button')}
                                                                onClick={event => confirmRemove(event, widget)}
                                                                className="removeWidgetButton"
                                                            />
                                                        </div>
                                                    )}
                                                </Item.Extra>
                                            </Item.Content>
                                        </StyledItem>
                                    ))}

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
                                        /* @ts-ignore InstallWidgetModal not migrated yet */
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

            {widgetToRemove && (
                <Confirm
                    open={showConfirm}
                    onCancel={unsetShowConfirm}
                    onConfirm={doUninstallWidget}
                    header={i18n.t(
                        'editMode.removeWidget.confirm',
                        `Are you sure to remove widget {{name}}`,
                        pick(widgetToRemove, 'name')
                    )}
                    content={confirmContent}
                    className="removeWidgetConfirm"
                />
            )}

            <Modal open={showThumbnail} basic closeOnDimmerClick closeOnDocumentClick onClose={closeThumbnailModal}>
                <div>{thumbnailWidget && <Image centered src={imageSrc(thumbnailWidget)} />}</div>
            </Modal>
        </AddWidgetModalWrapper>
    );
}

const MemoizedAddWidgetModal = React.memo(AddWidgetModal, isEqual);

const mapStateToProps = (state: ReduxState) => {
    const widgetDefinitions = state.widgetDefinitions.filter(definition => {
        const isLoadingDefinition = !definition.loaded;
        const isUserAuthorized = StageUtils.isUserAuthorized(definition.permission, state.manager);
        const isWidgetPermitted = StageUtils.isWidgetPermitted(definition.supportedEditions, state.manager);
        return isLoadingDefinition || (isUserAuthorized && isWidgetPermitted);
    });
    const canInstallWidgets = StageUtils.isUserAuthorized(Consts.permissions.STAGE_INSTALL_WIDGETS, state.manager);

    return {
        widgetDefinitions,
        canInstallWidgets
    };
};

const mapDispatchToProps = (dispatch: ReduxThunkDispatch) => {
    return {
        onWidgetInstalled: (widgetFile: File | null, widgetUrl: string) =>
            dispatch(installWidget(widgetFile, widgetUrl)),
        onWidgetUninstalled: (widgetId: string) => dispatch(uninstallWidget(widgetId)),
        onWidgetUpdated: (widgetId: string, widgetFile: File | null, widgetUrl: string) =>
            dispatch(replaceWidget(widgetId, widgetFile, widgetUrl)),
        onWidgetUsed: (widgetId: string) => dispatch(checkIfWidgetIsUsed(widgetId))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(MemoizedAddWidgetModal);
