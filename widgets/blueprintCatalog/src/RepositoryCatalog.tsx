import { noop } from 'lodash';
import type { FunctionComponent } from 'react';
import styled from 'styled-components';

import Consts from './consts';
import Utils from './utils';
import type { RepositoryViewProps } from './types';
import ExternalBlueprintImage from './ExternalBlueprintImage';

const { DataSegment, Grid, Button, Header } = Stage.Basic;
const t = Utils.getWidgetTranslation('catalog.properties');

const StyledDataSegment = styled(DataSegment.Item)`
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-direction: column;
`;

const StyledGridColumnButtons = styled(Grid.Column)`
    &&&& {
        display: flex;
        align-items: center;
        padding: 0;
    }
`;

const StyledLinkButton = styled(Button)`
    &&&& {
        padding: 0;
        margin-right: 10px;
        font-size: 22px;
        background: none;
        &:hover {
            text-decoration: none !important;
            color: black;
        }
    }
`;

const RepositoryCatalog: FunctionComponent<RepositoryViewProps> = ({
    fetchData = noop,
    onSelect = noop,
    onUpload = noop,
    readmeLoading = null,
    data,
    noDataMessage,
    onReadme,
    widget
}) => {
    const catalogItems = data.items.map(item => {
        /* eslint-disable camelcase */
        const {
            id,
            name,
            description,
            created_at,
            updated_at,
            html_url,
            isSelected,
            image_url,
            readme_url,
            zip_url,
            main_blueprint
        } = item;

        return (
            <Grid.Column key={id}>
                <StyledDataSegment
                    selected={isSelected}
                    onClick={(event: Event) => {
                        event.stopPropagation();
                        onSelect(item);
                    }}
                    className="fullHeight"
                >
                    <Grid className="contentBlock">
                        <Grid.Row className="bottomDivider">
                            <Grid.Column width="16">
                                <ExternalBlueprintImage url={image_url} width={50} />
                                <Header>{name}</Header>
                            </Grid.Column>
                        </Grid.Row>

                        <Grid.Column width="16">{description}</Grid.Column>

                        <Grid.Row className="noPadded">
                            <Grid.Column width="4">
                                <h5 className="ui icon header">{t('created')}</h5>
                            </Grid.Column>
                            <Grid.Column width="12">{created_at}</Grid.Column>
                        </Grid.Row>

                        <Grid.Row className="noPadded">
                            <Grid.Column width="4">
                                <h5 className="ui icon header">{t('updated')}</h5>
                            </Grid.Column>
                            <Grid.Column width="12">{updated_at}</Grid.Column>
                        </Grid.Row>
                    </Grid>
                    <Grid container>
                        <Grid.Row className="noPadded" style={{ marginBottom: '1rem' }}>
                            <StyledGridColumnButtons width="8">
                                <Button
                                    circular
                                    icon="github"
                                    onClick={() => Stage.Utils.Url.redirectToPage(html_url)}
                                />

                                <Button
                                    circular
                                    icon="info"
                                    loading={readmeLoading === name}
                                    className="readmeButton noPadded"
                                    onClick={event => {
                                        event.stopPropagation();
                                        onReadme(name, readme_url);
                                    }}
                                />
                            </StyledGridColumnButtons>
                            <Grid.Column width="8" textAlign="right" className="noPadded">
                                <Button
                                    disabled={data.uploadedBlueprints.includes(name)}
                                    content="Upload"
                                    className="uploadButton"
                                    onClick={event => {
                                        event.stopPropagation();
                                        onUpload(name, zip_url, image_url, main_blueprint);
                                    }}
                                />
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </StyledDataSegment>
            </Grid.Column>
        );
    });
    /* eslint-enable camelcase */

    const catalogRows = [];
    let row: typeof catalogItems = [];
    _.each(catalogItems, (catalogItem, index) => {
        row.push(catalogItem);
        if ((index + 1) % 3 === 0) {
            catalogRows.push(
                <Grid.Row key={catalogRows.length + 1} columns="3">
                    {row}
                </Grid.Row>
            );
            row = [];
        }
    });
    if (row.length > 0) {
        catalogRows.push(
            <Grid.Row key={catalogRows.length + 1} columns="3">
                {row}
            </Grid.Row>
        );
    }

    // Show pagination only in case when data is provided from GitHub
    const pageSize = data.source === Consts.GITHUB_DATA_SOURCE ? widget.configuration.pageSize : data.total;
    const totalSize = data.source === Consts.GITHUB_DATA_SOURCE ? data.total : -1;

    return (
        <DataSegment
            totalSize={totalSize}
            pageSize={pageSize}
            fetchData={fetchData}
            className="repositoryCatalog"
            noDataMessage={noDataMessage}
        >
            <Grid>{catalogRows}</Grid>
        </DataSegment>
    );
};

export default RepositoryCatalog;
