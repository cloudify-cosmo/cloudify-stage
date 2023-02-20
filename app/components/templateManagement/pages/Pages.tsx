import type { FunctionComponent } from 'react';
import React from 'react';
import i18n from 'i18next';
import type { SemanticICONS } from 'semantic-ui-react';
import type { CreatePageModalProps } from './CreatePageModal';
import CreatePageModal from './CreatePageModal';
import TemplateList from '../common/TemplateList';
import { DataTable, Header, Icon, PopupConfirm, Segment } from '../../basic';
import StageUtils from '../../../utils/stageUtils';
import ItemsList from '../common/ItemsList';
import ItemsCount from '../common/ItemsCount';

const tTemplates = StageUtils.getT('templates');
const tPageManagement = StageUtils.composeT(tTemplates, 'pageManagement');

export interface Page {
    custom: boolean;
    id: string;
    name: string;
    icon?: SemanticICONS;
    selected: boolean;
    templates: string[];
    pageGroups: string[];
    updatedAt: string;
    updatedBy: string;
}

export interface PagesProps {
    onCanDeletePage: (page: Page) => void;
    onCreatePage: CreatePageModalProps['onCreatePage'];
    onDeletePage: (page: Page) => void;
    onEditPage: (page: Page) => void;
    onPreviewPage: (page: Page) => void;
    onSelectPage: (page: Page) => void;
    pages: Page[];
}

const Pages: FunctionComponent<PagesProps> = ({
    onCanDeletePage,
    onCreatePage,
    onDeletePage,
    onEditPage,
    onPreviewPage,
    onSelectPage,
    pages = []
}) => {
    return (
        <Segment color="red">
            <Header dividing as="h5">
                {tTemplates('pages')}
            </Header>

            <DataTable>
                <DataTable.Column label={tPageManagement('table.pageID')} width="25%" />
                <DataTable.Column label={tPageManagement('table.pageName')} width="25%" />
                <DataTable.Column label={tPageManagement('table.icon')} width="1%" />
                <DataTable.Column label={tPageManagement('table.templates')} width="1%" />
                <DataTable.Column label={tPageManagement('table.pageGroups')} width="1%" />
                <DataTable.Column label={tPageManagement('table.updatedAt')} width="15%" />
                <DataTable.Column label={tPageManagement('table.updatedBy')} width="15%" />
                <DataTable.Column width="10%" />

                {pages.map(item => {
                    return (
                        <DataTable.RowExpandable key={item.id} expanded={item.selected}>
                            <DataTable.Row key={item.id} selected={item.selected} onClick={() => onSelectPage(item)}>
                                <DataTable.Data>
                                    <Header as="a" size="small">
                                        {item.id}
                                    </Header>
                                </DataTable.Data>
                                <DataTable.Data>{item.name}</DataTable.Data>
                                <DataTable.Data>
                                    <Icon name={item.icon} />
                                </DataTable.Data>
                                <DataTable.Data>
                                    <ItemsCount items={item.templates} />
                                </DataTable.Data>
                                <DataTable.Data>
                                    <ItemsCount items={item.pageGroups} />
                                </DataTable.Data>
                                <DataTable.Data>
                                    {item.updatedAt && StageUtils.Time.formatLocalTimestamp(item.updatedAt)}
                                </DataTable.Data>
                                <DataTable.Data>{item.updatedBy}</DataTable.Data>
                                <DataTable.Data className="center aligned rowActions">
                                    {item.custom ? (
                                        <div>
                                            <PopupConfirm
                                                trigger={
                                                    <Icon
                                                        name="remove"
                                                        link
                                                        onClick={(e: Event) => e.stopPropagation()}
                                                    />
                                                }
                                                content={i18n.t(
                                                    'templates.pageManagement.removeConfirm',
                                                    'Are you sure to remove this page?'
                                                )}
                                                onConfirm={() => onDeletePage(item)}
                                                onCanConfirm={() => onCanDeletePage(item)}
                                                onCancel={undefined}
                                                defaultOpen={false}
                                            />
                                            <Icon
                                                name="edit"
                                                link
                                                className="updatePageIcon"
                                                onClick={(e: Event) => {
                                                    e.stopPropagation();
                                                    onEditPage(item);
                                                }}
                                            />
                                        </div>
                                    ) : (
                                        <div>
                                            <Icon
                                                name="search"
                                                link
                                                className="updatePageIcon"
                                                onClick={(e: Event) => {
                                                    e.stopPropagation();
                                                    onPreviewPage(item);
                                                }}
                                            />
                                        </div>
                                    )}
                                </DataTable.Data>
                            </DataTable.Row>

                            <DataTable.DataExpandable
                                key={item.id}
                                numberOfColumns={1}
                                style={{ backgroundColor: 'white' }}
                            >
                                <Segment.Group horizontal>
                                    <TemplateList
                                        width="50%"
                                        templates={item.templates}
                                        noDataMessageKey="pageManagement.notUsedByTemplate"
                                    />
                                    <ItemsList
                                        width="50%"
                                        icon="folder open outline"
                                        items={item.pageGroups}
                                        noDataMessageI18nKey="pageManagement.notUsedByGroup"
                                        titleI18nKey="usedByPageGroups"
                                    />
                                </Segment.Group>
                            </DataTable.DataExpandable>
                        </DataTable.RowExpandable>
                    );
                })}

                <DataTable.Action>
                    <CreatePageModal onCreatePage={onCreatePage} />
                </DataTable.Action>
            </DataTable>
        </Segment>
    );
};

export default Pages;
