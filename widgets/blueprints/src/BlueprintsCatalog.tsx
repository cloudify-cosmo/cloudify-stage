import styled from 'styled-components';
import { TextEllipsis } from '../../../app/components/shared';
import { translateBlueprints } from './widget.utils';

import BlueprintState from './BlueprintState';
import type { BlueprintsViewProps } from './types';

const translateBlueprintsButtons = Stage.Utils.composeT(translateBlueprints, 'buttons');

const StyledGridWrapper = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 3fr));
    grid-gap: 20px;
`;

export default function BlueprintsCatalog({
    data,
    fetchData,
    noDataMessage,
    onCreateDeployment,
    onDeleteBlueprint,
    onSelectBlueprint,
    onSetVisibility,
    widget,
    toolbox
}: BlueprintsViewProps) {
    const { DataSegment, Grid, Button, Label, ResourceVisibility, Header } = Stage.Basic;
    const { Blueprints } = Stage.Common;
    const { allowedVisibilitySettings } = Stage.Common.Consts;
    const manager = toolbox.getManager();
    const { fieldsToShow } = widget.configuration;

    const blueprintsItems = data.items.map(item => {
        const {
            id,
            description,
            created_at: createdAt,
            updated_at: updatedAt,
            created_by: createdBy,
            isSelected,
            visibility: itemVisibility,
            depCount,
            main_file_name: mainFileName
        } = item;

        return (
            <div key={id} data-testid={id}>
                <DataSegment.Item
                    selected={isSelected}
                    className="fullHeight"
                    onClick={event => {
                        event.stopPropagation();
                        onSelectBlueprint(item);
                    }}
                >
                    <Grid>
                        <Grid.Row>
                            <Grid.Column>
                                {Blueprints.Actions.isUploaded(item) && (
                                    <Blueprints.UploadedImage
                                        blueprintId={id}
                                        tenantName={manager.getSelectedTenant()}
                                        width={50}
                                    />
                                )}
                                <ResourceVisibility
                                    visibility={itemVisibility}
                                    onSetVisibility={visibility => onSetVisibility(id, visibility)}
                                    allowedSettingTo={allowedVisibilitySettings}
                                    className="rightFloated"
                                />
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row className="bottomDivider">
                            <Grid.Column>
                                <Header
                                    style={{
                                        maxWidth: 'fit-content',
                                        marginLeft: 'unset',
                                        display: 'block'
                                    }}
                                >
                                    <a href="#!" className="breakWord">
                                        {id}
                                    </a>
                                </Header>
                            </Grid.Column>
                        </Grid.Row>

                        <Grid.Row title={description}>
                            <Grid.Column>
                                <TextEllipsis>{description}</TextEllipsis>
                            </Grid.Column>
                        </Grid.Row>
                        {fieldsToShow?.includes('Created') && (
                            <Grid.Row className="noPadded">
                                <Grid.Column width="7">
                                    <Header as="h5" content="Created" />
                                </Grid.Column>
                                <Grid.Column width="9">{createdAt}</Grid.Column>
                            </Grid.Row>
                        )}
                        {fieldsToShow?.includes('Updated') && (
                            <Grid.Row className="noPadded">
                                <Grid.Column width="7">
                                    <Header as="h5" content="Updated" />
                                </Grid.Column>
                                <Grid.Column width="9">{updatedAt}</Grid.Column>
                            </Grid.Row>
                        )}
                        {fieldsToShow?.includes('Creator') && (
                            <Grid.Row className="noPadded">
                                <Grid.Column width="7">
                                    <Header as="h5" content="Creator" />
                                </Grid.Column>
                                <Grid.Column width="9">{createdBy}</Grid.Column>
                            </Grid.Row>
                        )}
                        {fieldsToShow?.includes('State') && (
                            <Grid.Row className="noPadded">
                                <Grid.Column width="7">
                                    <Header as="h5" content="State" />
                                </Grid.Column>
                                <Grid.Column width="9">
                                    <BlueprintState blueprint={item} />
                                </Grid.Column>
                            </Grid.Row>
                        )}
                        {fieldsToShow?.includes('Deployments') && (
                            <Grid.Row className="noPadded">
                                <Grid.Column width="7">
                                    <Header as="h5" content="# Deployments" />
                                </Grid.Column>
                                <Grid.Column width="9">
                                    <Label color="green" horizontal>
                                        {depCount}
                                    </Label>
                                </Grid.Column>
                            </Grid.Row>
                        )}
                    </Grid>
                    {Blueprints.Actions.isCompleted(item) && (
                        <Grid style={{ marginTop: 'auto', paddingTop: '2rem' }}>
                            <Grid.Row>
                                <Grid.Column textAlign="center" className="actionButtons">
                                    <Button
                                        icon="trash"
                                        content={translateBlueprintsButtons('delete')}
                                        basic
                                        onClick={event => {
                                            event.stopPropagation();
                                            onDeleteBlueprint(item);
                                        }}
                                    />
                                    {Blueprints.Actions.isUploaded(item) && (
                                        <>
                                            <Button
                                                icon="rocket"
                                                content={translateBlueprintsButtons('deploy')}
                                                onClick={event => {
                                                    event.stopPropagation();
                                                    onCreateDeployment(item);
                                                }}
                                            />

                                            {!manager.isCommunityEdition() && widget.configuration.showComposerOptions && (
                                                <Button
                                                    icon="external share"
                                                    content={translateBlueprintsButtons('editInComposer')}
                                                    onClick={event => {
                                                        event.stopPropagation();
                                                        new Stage.Common.Blueprints.Actions(toolbox).doEditInComposer(
                                                            id,
                                                            mainFileName
                                                        );
                                                    }}
                                                    style={{ width: '247px' }}
                                                />
                                            )}
                                        </>
                                    )}
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    )}
                </DataSegment.Item>
            </div>
        );
    });

    return (
        <DataSegment
            totalSize={data.total}
            pageSize={widget.configuration.pageSize}
            fetchData={fetchData}
            className="blueprintCatalog"
            searchable
            noDataMessage={noDataMessage}
        >
            <StyledGridWrapper>{blueprintsItems}</StyledGridWrapper>
        </DataSegment>
    );
}
