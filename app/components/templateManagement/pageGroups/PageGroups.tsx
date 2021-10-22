import React, { FunctionComponent } from 'react';
import { DataTable, Header, Segment } from '../../basic';
import StageUtils from '../../../utils/stageUtils';
import { useResettableState } from '../../../utils/hooks';
import TemplateList from '../common/TemplateList';
import ItemsCount from '../common/ItemsCount';
import ReadOnlyList from '../common/ReadOnlyList';

const tTemplates = StageUtils.getT('templates');
const tPageGroupManagement = StageUtils.composeT(tTemplates, 'pageGroupManagement');

interface PageGroup {
    id: string;
    name: string;
    templates: string[];
    updatedAt: string;
    updatedBy: string;
    pages: string[];
}

interface PageGroupsProps {
    pageGroups: PageGroup[];
}

const PageGroups: FunctionComponent<PageGroupsProps> = ({ pageGroups = [] }) => {
    const [selectedItemId, setSelectedItemId, clearSelectedItemId] = useResettableState<string | null>(null);

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
                        </DataTable.Row>
                        <DataTable.DataExpandable numberOfColumns={1} key={item.id}>
                            <Segment.Group horizontal>
                                <ReadOnlyList width="50%" items={item.pages} titleKey="pages" icon="file outline" />
                                <TemplateList
                                    width="50%"
                                    templates={item.templates}
                                    noDataMessageKey="pageGroupManagement.notUsed"
                                />
                            </Segment.Group>
                        </DataTable.DataExpandable>
                    </DataTable.RowExpandable>
                ))}
            </DataTable>
        </Segment>
    );
};

export default PageGroups;
