import { noop } from 'lodash';
import type { FunctionComponent } from 'react';
import styled from 'styled-components';

import { GridWrapper } from '../../../app/components/shared';
import Consts from './consts';
import Utils from './utils';
import type { RepositoryViewProps } from './types';
import ExternalBlueprintImage from './ExternalBlueprintImage';
import RepositoryLinkButton from './RepositoryLinkButton';

const { DataSegment, Grid, Button, Header } = Stage.Basic;
const t = Utils.getWidgetTranslation('blueprintCatalog');

const StyledDataSegment = styled(DataSegment.Item)`
    && {
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
    }
`;

const StyledColumn = styled(Grid.Column)`
    &&&& {
        padding: 0;
    }
`;

const StyledGridColumnButtons = styled(Grid.Column)`
    &&&& {
        display: flex;
        align-items: center;
        padding: 0;
    }
`;

const StyledGridRowHeader = styled(Grid.Row)`
    &&&& {
        display: flex;
        align-items: center;
        flex-wrap: nowrap;
        border-bottom: 1px solid #ebebeb;
        padding: 10px 0;
        min-height: 51px;
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
    onOpenBlueprintPage = noop,
    readmeLoading = null,
    data,
    noDataMessage,
    onReadme,
    widget
}) => {
    const { fieldsToShow, displayStyle } = widget.configuration;
    const showName = fieldsToShow.includes(t('configuration.fieldsToShow.items.name'));
    const showDescription = fieldsToShow.includes(t('configuration.fieldsToShow.items.description'));
    const showCreated = fieldsToShow.includes(t('configuration.fieldsToShow.items.created'));
    const showUpdated = fieldsToShow.includes(t('configuration.fieldsToShow.items.updated'));

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
        const isBlueprintUploaded = data.uploadedBlueprints.includes(name);

        return (
            <div key={id}>
                <StyledDataSegment
                    selected={isSelected}
                    onClick={event => {
                        event.stopPropagation();
                        onSelect(item);
                    }}
                >
                    <Grid container className="contentBlock">
                        <StyledGridRowHeader>
                            <ExternalBlueprintImage url={image_url} width={25} />
                            {showName && <StyledHeader>{name}</StyledHeader>}
                        </StyledGridRowHeader>
                        {showDescription && (
                            <Grid.Row>
                                <StyledColumn>
                                    <StyledText>{description}</StyledText>
                                </StyledColumn>
                            </Grid.Row>
                        )}

                        {showCreated && (
                            <Grid.Row className="noPadded">
                                <StyledColumn
                                    style={{
                                        marginTop: !(showName && showDescription) ? '1rem' : 0,
                                        marginBottom: '5px'
                                    }}
                                >
                                    <StyledText>
                                        <strong>{t('catalog.properties.created')}</strong> {created_at}
                                    </StyledText>
                                </StyledColumn>
                            </Grid.Row>
                        )}

                        {showUpdated && (
                            <Grid.Row className="noPadded">
                                <StyledColumn
                                    style={{
                                        marginTop: !((showName && showDescription) || showCreated) ? '1rem' : 0
                                    }}
                                >
                                    <StyledText>
                                        <strong>{t('catalog.properties.updated')}</strong> {updated_at}
                                    </StyledText>
                                </StyledColumn>
                            </Grid.Row>
                        )}
                    </Grid>
                    <Grid container>
                        <Grid.Row className="noPadded" style={{ marginBottom: '1rem' }}>
                            <StyledGridColumnButtons width="8">
                                <RepositoryLinkButton url={html_url} displayStyle={displayStyle} />

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
                                {isBlueprintUploaded ? (
                                    <Button
                                        content={t('buttons.open')}
                                        onClick={() => {
                                            onOpenBlueprintPage(name);
                                        }}
                                        title={t('actions.openBlueprint')}
                                    />
                                ) : (
                                    <Button
                                        content={t('buttons.upload')}
                                        onClick={() => {
                                            onUpload(name, zip_url, image_url, main_blueprint);
                                        }}
                                        title={t('actions.uploadBlueprint')}
                                    />
                                )}
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </StyledDataSegment>
            </div>
        );
        /* eslint-enable camelcase */
    });

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
            <GridWrapper>{catalogItems}</GridWrapper>
        </DataSegment>
    );
};

export default RepositoryCatalog;
