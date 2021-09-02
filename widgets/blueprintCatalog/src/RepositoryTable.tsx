import { noop } from 'lodash';
import type { FunctionComponent } from 'react';

import Consts from './consts';
import type { RepositoryViewProps } from './types';

const RepositoryTable: FunctionComponent<RepositoryViewProps> = ({
    fetchData = noop,
    onSelect = noop,
    onUpload = noop,
    readmeLoading = null,
    uploadingInProgress = [],
    data,
    noDataMessage,
    onReadme,
    widget
}) => {
    const { DataTable, Image, Icon } = Stage.Basic;

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
            <DataTable.Column label="Name" width="25%" show={fieldsToShow.includes('Name')} />
            <DataTable.Column label="Description" width="40%" show={fieldsToShow.includes('Description')} />
            <DataTable.Column label="Created" width="12%" show={fieldsToShow.includes('Created')} />
            <DataTable.Column label="Updated" width="12%" show={fieldsToShow.includes('Updated')} />
            <DataTable.Column width="11%" />

            {data.items.map(item => {
                const isLoading = readmeLoading === item.name;
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
                                name={isLoading ? 'spinner' : 'info'}
                                link={!isLoading}
                                title="Blueprint Readme"
                                loading={isLoading}
                                bordered={!isLoading}
                                onClick={(event: Event) => {
                                    event.stopPropagation();
                                    onReadme(item.name, item.readme_url);
                                }}
                            />
                            <Icon
                                name={uploadingInProgress.includes(item.name) ? 'spinner' : 'upload'}
                                disabled={data.uploadedBlueprints.includes(item.name)}
                                link
                                title="Upload blueprint"
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
