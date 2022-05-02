import { noop } from 'lodash';
import { FunctionComponent } from 'react';

import Consts from './consts';
import type { RepositoryViewProps } from './types';

const t = Stage.Utils.getT('widgets.blueprintCatalog');
const { DataTable, Image, Icon } = Stage.Basic;

const RepositoryTable: FunctionComponent<RepositoryViewProps> = ({
    fetchData = noop,
    onSelect = noop,
    onUpload = Promise.resolve,
    readmeLoading = null,
    data,
    noDataMessage,
    onReadme,
    widget
}) => {
    // Show pagination only in case when data is provided from GitHub
    const pageSize = data.source === Consts.GITHUB_DATA_SOURCE ? widget.configuration.pageSize : data.total;
    const totalSize = data.source === Consts.GITHUB_DATA_SOURCE ? data.total : -1;
    const { fieldsToShow } = widget.configuration;

    return (
        <DataTable
            fetchData={fetchData}
            pageSize={pageSize}
            sortColumn={widget.configuration.sortColumn}
            sortAscending={widget.configuration.sortAscending}
            totalSize={totalSize}
            selectable
            noDataMessage={noDataMessage}
        >
            <DataTable.Column
                label={t('configuration.fieldsToShow.items.name')}
                width="25%"
                show={fieldsToShow.includes(t('configuration.fieldsToShow.items.name'))}
            />
            <DataTable.Column
                label={t('configuration.fieldsToShow.items.description')}
                width="40%"
                show={fieldsToShow.includes(t('configuration.fieldsToShow.items.description'))}
            />
            <DataTable.Column
                label={t('configuration.fieldsToShow.items.created')}
                width="12%"
                show={fieldsToShow.includes(t('configuration.fieldsToShow.items.created'))}
            />
            <DataTable.Column
                label={t('configuration.fieldsToShow.items.updated')}
                width="12%"
                show={fieldsToShow.includes(t('configuration.fieldsToShow.items.updated'))}
            />
            <DataTable.Column width="11%" />

            {data.items.map(item => {
                const isReadmeLoading = readmeLoading === item.name;
                const isBlueprintUploaded = data.uploadedBlueprints.includes(item.name);

                return (
                    <DataTable.Row
                        key={item.id}
                        className={`bp_${item.name}`}
                        selected={item.isSelected}
                        onClick={() => onSelect(item)}
                    >
                        <DataTable.Data>
                            <Image src={Stage.Utils.Url.url(item.image_url)} width="30px" height="auto" inline />{' '}
                            <a href={item.html_url} target="_blank" rel="noopener noreferrer">
                                {item.name}
                            </a>
                        </DataTable.Data>
                        <DataTable.Data>{item.description}</DataTable.Data>
                        <DataTable.Data>{item.created_at}</DataTable.Data>
                        <DataTable.Data>{item.updated_at}</DataTable.Data>
                        <DataTable.Data className="center aligned rowActions">
                            <Icon
                                name={isReadmeLoading ? 'spinner' : 'info'}
                                link={!isReadmeLoading}
                                title={t('actions.openDocumentation')}
                                loading={isReadmeLoading}
                                bordered={!isReadmeLoading}
                                onClick={(event: Event) => {
                                    event.stopPropagation();
                                    onReadme(item.name, item.readme_url);
                                }}
                            />
                            <Icon
                                name={'upload'}
                                disabled={isBlueprintUploaded}
                                link={!isBlueprintUploaded}
                                title={t('actions.uploadBlueprint')}
                                bordered
                                onClick={(event: Event) => {
                                    event.stopPropagation();
                                    onUpload(item.name, item.zip_url, item.image_url, item.main_blueprint);
                                }}
                            />
                        </DataTable.Data>
                    </DataTable.Row>
                );
            })}
        </DataTable>
    );
};

export default RepositoryTable;
