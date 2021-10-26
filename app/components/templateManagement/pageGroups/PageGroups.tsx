import React, { FunctionComponent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import _ from 'lodash';
import { Button, DataTable, Header, Icon, PopupConfirm, Segment } from '../../basic';
import StageUtils from '../../../utils/stageUtils';
import { useResettableState } from '../../../utils/hooks';
import TemplateList from '../common/TemplateList';
import ItemsCount from '../common/ItemsCount';
import ItemsList from '../common/ItemsList';
import PageGroupModal from './PageGroupModal';
import { createPageGroup, deletePageGroup, updatePageGroup } from '../../../actions/templateManagement/pageGroups';
import { ReduxState } from '../../../reducers';
import Internal from '../../../utils/Internal';

const tTemplates = StageUtils.getT('templates');
const tPageGroupManagement = StageUtils.composeT(tTemplates, 'pageGroupManagement');

interface PageGroup {
    id: string;
    name: string;
    templates: string[];
    updatedAt: string;
    updatedBy: string;
    pages: string[];
    custom: boolean;
}

interface PageGroupsProps {
    pageGroups: PageGroup[];
}

const PageGroups: FunctionComponent<PageGroupsProps> = ({ pageGroups = [] }) => {
    const [selectedItemId, setSelectedItemId, clearSelectedItemId] = useResettableState<string | null>(null);

    const internal = useSelector((state: ReduxState) => new Internal(state.manager));
    const pageGroupDefs = useSelector((state: ReduxState) => state.templates.pageGroupsDef);
    const dispatch = useDispatch();

    function handleRemovePageGroup(id: string) {
        return internal.doDelete(`/templates/page-groups/${id}`).then(() => dispatch(deletePageGroup(id)));
    }

    function handleRemovePage(groupId: string, pageId: string) {
        const body = {
            id: groupId,
            name: pageGroupDefs[groupId].name,
            pages: _.without(pageGroupDefs[groupId].pages, pageId)
        };
        return internal
            .doPut(`/templates/page-groups/${groupId}`, { body })
            .then(() => dispatch(updatePageGroup(groupId, groupId, body.name, body.pages)));
    }

    function createGroupId(name: string) {
        let id = _.snakeCase(name);
        let suffixIndex = 0;
        while (pageGroupDefs[`${id}_${suffixIndex}`]) suffixIndex += 1;
        if (suffixIndex) id = `${id}_${suffixIndex}`;
        return id;
    }

    function handleCreatePageGroup(name: string, pageIds: string[]) {
        const id = createGroupId(name);

        const body = {
            id,
            name,
            pages: pageIds
        };

        return internal
            .doPost('/templates/page-groups', { body })
            .then(() => dispatch(createPageGroup(id, name, pageIds)));
    }

    function handleUpdatePageGroup(id: string, name: string, pageIds: string[]) {
        const newId = createGroupId(name);

        const body = {
            id: newId,
            name,
            pages: pageIds
        };

        return internal
            .doPut(`/templates/page-groups/${id}`, { body })
            .then(() => dispatch(updatePageGroup(id, newId, name, pageIds)));
    }

    return (
        <Segment color="green">
            <Header dividing as="h5">
                {tTemplates('pageGroups')}
            </Header>

            <DataTable>
                <DataTable.Column label={tPageGroupManagement('table.groupId')} width="25%" />
                <DataTable.Column label={tPageGroupManagement('table.groupName')} width="25%" />
                <DataTable.Column label={tPageGroupManagement('table.templates')} width="10%" />
                <DataTable.Column label={tPageGroupManagement('table.updatedAt')} width="15%" />
                <DataTable.Column label={tPageGroupManagement('table.updatedBy')} width="15%" />
                <DataTable.Column width="10%" />

                {pageGroups.map(item => (
                    // @ts-ignore RowExpandable returns void
                    <DataTable.RowExpandable key={item.id} expanded={selectedItemId === item.id}>
                        <DataTable.Row
                            key={item.id}
                            onClick={() =>
                                selectedItemId === item.id ? clearSelectedItemId() : setSelectedItemId(item.id)
                            }
                            selected={selectedItemId === item.id}
                        >
                            <DataTable.Data>
                                <Header as="a" size="small">
                                    {item.id}
                                </Header>
                            </DataTable.Data>
                            <DataTable.Data>{item.name}</DataTable.Data>
                            <DataTable.Data>
                                <ItemsCount items={item.templates} />
                            </DataTable.Data>
                            <DataTable.Data>
                                {item.updatedAt && StageUtils.Time.formatLocalTimestamp(item.updatedAt)}
                            </DataTable.Data>
                            <DataTable.Data>{item.updatedBy}</DataTable.Data>
                            <DataTable.Data style={{ textAlign: 'center' }}>
                                {item.custom && (
                                    <>
                                        <PopupConfirm
                                            trigger={
                                                <Icon name="remove" link onClick={(e: Event) => e.stopPropagation()} />
                                            }
                                            content={tPageGroupManagement('removeConfirm')}
                                            onConfirm={() => handleRemovePageGroup(item.id)}
                                            onCanConfirm={undefined}
                                            onCancel={undefined}
                                            defaultOpen={undefined}
                                        />
                                        <PageGroupModal
                                            initialGroupName={item.name}
                                            initialPages={item.pages}
                                            onSubmit={(name, pages) => handleUpdatePageGroup(item.id, name, pages)}
                                            trigger={
                                                <Icon name="edit" link onClick={(e: Event) => e.stopPropagation()} />
                                            }
                                        />
                                    </>
                                )}
                            </DataTable.Data>
                        </DataTable.Row>
                        <DataTable.DataExpandable numberOfColumns={1} key={item.id}>
                            <Segment.Group horizontal>
                                <ItemsList
                                    removable={item.pages?.length > 1 && item.custom}
                                    width="50%"
                                    items={item.pages}
                                    titleI18nKey="pages"
                                    deleteConfirmI18nKey="pageGroupManagement.removePageConfirm"
                                    icon="file outline"
                                    onDelete={pageId => handleRemovePage(item.id, pageId)}
                                />
                                <TemplateList
                                    width="50%"
                                    templates={item.templates}
                                    noDataMessageKey="pageGroupManagement.notUsed"
                                />
                            </Segment.Group>
                        </DataTable.DataExpandable>
                    </DataTable.RowExpandable>
                ))}
                <DataTable.Action>
                    <PageGroupModal
                        onSubmit={handleCreatePageGroup}
                        trigger={
                            <Button
                                labelPosition="left"
                                icon="folder open outline"
                                content={tPageGroupManagement('createPageGroup')}
                            />
                        }
                    />
                </DataTable.Action>
            </DataTable>
        </Segment>
    );
};

export default PageGroups;
