import { noop } from 'lodash';
import type { FunctionComponent } from 'react';

import Utils from './utils';
import Consts from './consts';
import type { RepositoryViewProps } from './types';
import ExternalBlueprintImage from './ExternalBlueprintImage';
import RepositoryLinkButton from './RepositoryLinkButton';

const { DataTable, Icon } = Stage.Basic;
const t = Utils.getWidgetTranslation();

const RepositoryTable: FunctionComponent<RepositoryViewProps> = ({
    fetchData = noop,
    onSelect = noop,
    onUpload = Promise.resolve,
    onOpenBlueprintPage = noop,
    readmeLoading = null,
    data,
    noDataMessage,
    onReadme,
    widget
}) => {
    // Show pagination only in case when data is provided from GitHub
    const pageSize = data.source === Consts.GITHUB_DATA_SOURCE ? widget.configuration.pageSize : data.total;
    const totalSize = data.source === Consts.GITHUB_DATA_SOURCE ? data.total : -1;
    const { fieldsToShow, displayStyle } = widget.configuration;

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
                /* eslint-disable camelcase */
                const {
                    id,
                    name,
                    description,
                    created_at,
                    updated_at,
                    image_url,
                    isSelected,
                    html_url,
                    readme_url,
                    zip_url,
                    main_blueprint
                } = item;
                const isReadmeLoading = readmeLoading === name;
                const isBlueprintUploaded = data.uploadedBlueprints.includes(name);

                return (
                    <DataTable.Row
                        key={id}
                        className={`bp_${name}`}
                        selected={isSelected}
                        onClick={() => onSelect(item)}
                    >
                        <DataTable.Data>
                            <ExternalBlueprintImage url={image_url} width={25} />
                            <span style={{ marginLeft: '5px' }}>{name}</span>
                        </DataTable.Data>
                        <DataTable.Data>{description}</DataTable.Data>
                        <DataTable.Data>{created_at}</DataTable.Data>
                        <DataTable.Data>{updated_at}</DataTable.Data>
                        <DataTable.Data textAlign="center" className="rowActions">
                            <RepositoryLinkButton url={html_url} displayStyle={displayStyle} />
                            <Icon
                                name={isReadmeLoading ? 'spinner' : 'info'}
                                link={!isReadmeLoading}
                                title={t('actions.openDocumentation')}
                                loading={isReadmeLoading}
                                onClick={(event: Event) => {
                                    event.stopPropagation();
                                    onReadme(name, readme_url);
                                }}
                            />
                            {isBlueprintUploaded ? (
                                <Icon
                                    link={!isBlueprintUploaded}
                                    name="arrow right"
                                    title={t('actions.openBlueprint')}
                                    onClick={() => {
                                        onOpenBlueprintPage(name);
                                    }}
                                />
                            ) : (
                                <Icon
                                    name="upload"
                                    link={!isBlueprintUploaded}
                                    title={t('actions.uploadBlueprint')}
                                    onClick={() => {
                                        onUpload(name, zip_url, image_url, main_blueprint);
                                    }}
                                />
                            )}
                        </DataTable.Data>
                    </DataTable.Row>
                    /* eslint-enable camelcase */
                );
            })}
        </DataTable>
    );
};

export default RepositoryTable;
