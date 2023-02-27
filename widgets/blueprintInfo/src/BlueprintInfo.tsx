import type { BlueprintInfoData } from 'widgets/blueprintInfo/src/types';
import type { FunctionComponent } from 'react';

const translate = Stage.Utils.getT('widgets.blueprintInfo.fields');

interface BlueprintInfoProps {
    data: BlueprintInfoData;
    toolbox: Stage.Types.Toolbox;
}

const BlueprintInfo: FunctionComponent<BlueprintInfoProps> = ({ data, toolbox }) => {
    const { Grid, Header, ResourceVisibility, Label } = Stage.Basic;
    const { Blueprints } = Stage.Common;
    const tenantName = toolbox.getManager().getSelectedTenant();
    const blueprint = data;

    return (
        <div>
            <Grid>
                <Grid.Row className="bottomDivider">
                    <Grid.Column width="14">
                        <Header as="h3">
                            {Blueprints.Actions.isUploaded(blueprint) && (
                                <Blueprints.UploadedImage
                                    blueprintId={blueprint.id}
                                    tenantName={tenantName}
                                    width={50}
                                />
                            )}
                            <span style={{ marginLeft: 10 }}>{blueprint.id}</span>
                        </Header>
                    </Grid.Column>
                    <Grid.Column width="2">
                        <ResourceVisibility visibility={blueprint.visibility} className="rightFloated" />
                    </Grid.Column>
                </Grid.Row>

                <Grid.Column width="16">{blueprint.description}</Grid.Column>

                <Grid.Row>
                    <Grid.Column width="7">
                        <Header as="h5">{translate('created')}</Header>
                    </Grid.Column>
                    <Grid.Column width="9">{blueprint.created_at}</Grid.Column>
                </Grid.Row>

                <Grid.Row>
                    <Grid.Column width="7">
                        <Header as="h5">{translate('updated')}</Header>
                    </Grid.Column>
                    <Grid.Column width="9">{blueprint.updated_at}</Grid.Column>
                </Grid.Row>

                <Grid.Row>
                    <Grid.Column width="7">
                        <Header as="h5">{translate('creator')}</Header>
                    </Grid.Column>
                    <Grid.Column width="9">{blueprint.created_by}</Grid.Column>
                </Grid.Row>

                <Grid.Row>
                    <Grid.Column width="7">
                        <Header as="h5">{translate('mainFile')}</Header>
                    </Grid.Column>
                    <Grid.Column width="9">{blueprint.main_file_name}</Grid.Column>
                </Grid.Row>

                <Grid.Row>
                    <Grid.Column width="7">
                        <Header as="h5">{translate('deployments')}</Header>
                    </Grid.Column>
                    <Grid.Column width="9">
                        <Label color="green" horizontal>
                            {blueprint.deployments}
                        </Label>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </div>
    );
};

export default BlueprintInfo;
