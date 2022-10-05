import { noop } from 'lodash';
import type { FunctionComponent } from 'react';
import styled from 'styled-components';

import Consts from './consts';
import Utils from './utils';
import type { RepositoryViewProps } from './types';
import ExternalBlueprintImage from './ExternalBlueprintImage';

const { DataSegment, Grid, Button, Header } = Stage.Basic;
const t = Utils.getWidgetTranslation('blueprintCatalog');

const StyledDataSegment = styled(DataSegment.Item)`
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    flex-direction: column;
    transition: box-shadow 0.1s ease-in-out;
    border-color: #ebebeb;
    border-radius: 5px;
    background-color: #fff !important;
    color: inherit;
    height: 100%;
    &:hover {
        border: 1px solid #65adff;
        box-shadow: 0 2px 4px 0 rgba(95, 89, 89, 0.38) !important;
        background-color: #fff;
    }
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
            color: #1b1f23;
        }
    }
`;

const StyledGridRowHeader = styled(Grid.Row)`
    &&&& {
        display: flex;
        align-items: center;
        border-bottom: 1px solid #ebebeb;
        margin: 0 10px 3px 10px;
        padding: 10px 0;
    }
`;

const StyledHeader = styled(Header)`
    &&&& {
        margin: 0 0 0 18px;
        font-size: 16px;
        line-height: normal;
        display: inline;
    }
`;

const StyledText = styled.p`
    font-size: 12px;
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
                >
                    <Grid className="contentBlock">
                        <StyledGridRowHeader>
                            <ExternalBlueprintImage url={image_url} width={30} />
                            <StyledHeader>{name}</StyledHeader>
                        </StyledGridRowHeader>
                        <Grid.Row>
                            <Grid.Column>
                                <StyledText>{description}</StyledText>
                            </Grid.Column>
                        </Grid.Row>

                        <Grid.Row className="noPadded">
                            <Grid.Column style={{ marginBottom: '5px' }}>
                                <StyledText>
                                    <strong>{t('catalog.properties.created')}</strong> {created_at}
                                </StyledText>
                            </Grid.Column>
                        </Grid.Row>

                        <Grid.Row className="noPadded">
                            <Grid.Column>
                                <StyledText>
                                    <strong>{t('catalog.properties.updated')}</strong> {updated_at}
                                </StyledText>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                    <Grid container>
                        <Grid.Row className="noPadded" style={{ marginBottom: '1rem' }}>
                            <StyledGridColumnButtons width="8">
                                <StyledLinkButton
                                    circular
                                    icon="github"
                                    onClick={() => Stage.Utils.Url.redirectToPage(html_url)}
                                    title={t('actions.openBlueprintRepository')}
                                />

                                <Button
                                    circular
                                    icon="info"
                                    loading={readmeLoading === name}
                                    className="noPadded"
                                    onClick={event => {
                                        event.stopPropagation();
                                        onReadme(name, readme_url);
                                    }}
                                    title={t('actions.openDocumentation')}
                                />
                            </StyledGridColumnButtons>
                            <Grid.Column width="8" textAlign="right" className="noPadded">
                                <Button
                                    disabled={data.uploadedBlueprints.includes(name)}
                                    content="Upload"
                                    onClick={event => {
                                        event.stopPropagation();
                                        onUpload(name, zip_url, image_url, main_blueprint);
                                    }}
                                    title={t('actions.uploadBlueprint')}
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
