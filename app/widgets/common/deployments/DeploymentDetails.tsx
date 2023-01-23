import React from 'react';
import type { ReactNode, CSSProperties } from 'react';
import { isEmpty } from 'lodash';
import type { ResourceVisibilityProps } from 'cloudify-ui-components/typings/components/cloudify/visibility/ResourceVisibility/ResourceVisibility';
import NodeInstancesSummary from '../nodes/NodeInstancesSummary';
import Consts from '../Consts';
import { Grid, Header, ResourceVisibility } from '../../../components/basic';
import { TextEllipsis } from '../../../components/shared';
import type { Deployment } from './DeploymentDetails.types';

interface DeploymentParameterProps {
    name: ReactNode;
    as?: string;
    headerStyle?: CSSProperties;
    subHeaderStyle?: CSSProperties;
    value: ReactNode;
}

function DeploymentParameter({
    name,
    value = '',
    as = 'h5',
    headerStyle = {},
    subHeaderStyle = {}
}: DeploymentParameterProps) {
    return (
        <Header as={as} style={{ marginBlockStart: 0, ...headerStyle }}>
            {name}
            <Header.Subheader style={subHeaderStyle}>{value}</Header.Subheader>
        </Header>
    );
}

interface DeploymentDetailsProps {
    deployment: Deployment;
    instancesCount: number;
    instancesStates: {
        [key: string]: number;
    };
    onSetVisibility: ResourceVisibilityProps['onSetVisibility'];
    big?: boolean;
    customName?: ReactNode;
    customActions?: ReactNode;
}

export default function DeploymentDetails({
    big,
    customActions,
    customName,
    deployment,
    instancesCount,
    instancesStates,
    onSetVisibility
}: DeploymentDetailsProps) {
    const showBlueprint = 'blueprint_id' in deployment;
    const showSiteName = 'site_name' in deployment && !isEmpty(deployment.site_name);
    const showCreated = 'created_at' in deployment;
    const showUpdated = 'updated_at' in deployment && deployment.isUpdated;
    const showCreator = 'created_by' in deployment;
    const showNodeInstances = instancesStates !== null;
    const as = big ? 'h3' : 'h5';
    const stackable = !big;

    const resourceVisibility = (
        <ResourceVisibility
            allowedSettingTo={Consts.allowedVisibilitySettings}
            visibility={deployment.visibility}
            onSetVisibility={onSetVisibility}
            className="rightFloated"
        />
    );

    return (
        <Grid stackable={stackable}>
            <Grid.Row>
                <Grid.Column width={4}>
                    {customName ? (
                        <>
                            {resourceVisibility}
                            {customName}
                        </>
                    ) : (
                        <DeploymentParameter
                            as="h3"
                            name={
                                <div>
                                    <span style={{ fontSize: 14 }}>{resourceVisibility}</span>
                                    <TextEllipsis multiline={4}>{deployment.display_name}</TextEllipsis>
                                </div>
                            }
                            value={deployment.description}
                            headerStyle={{
                                wordBreak: 'break-word',
                                display: 'flex',
                                flexDirection: 'column',
                                position: 'absolute',
                                bottom: 0,
                                top: 0,
                                width: '100%'
                            }}
                            subHeaderStyle={{ overflow: 'auto', marginRight: '.75rem' }}
                        />
                    )}
                </Grid.Column>
                {(showBlueprint || showSiteName) && (
                    <Grid.Column width={3}>
                        {showBlueprint && (
                            <DeploymentParameter
                                as={as}
                                name="Blueprint"
                                value={deployment.blueprint_id}
                                subHeaderStyle={{
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                    maxWidth: '450px',
                                    wordBreak: 'break-word'
                                }}
                            />
                        )}
                        {showSiteName && <DeploymentParameter as={as} name="Site Name" value={deployment.site_name} />}
                    </Grid.Column>
                )}
                {(showCreated || showUpdated) && (
                    <Grid.Column width={3}>
                        {showCreated && <DeploymentParameter as={as} name="Created" value={deployment.created_at} />}
                        {showUpdated && <DeploymentParameter as={as} name="Updated" value={deployment.updated_at} />}
                    </Grid.Column>
                )}
                {showCreator && (
                    <Grid.Column width={2}>
                        <DeploymentParameter as={as} name="Creator" value={deployment.created_by} />
                    </Grid.Column>
                )}
                {showNodeInstances && (
                    <Grid.Column width={customActions ? 3 : 4}>
                        <DeploymentParameter
                            as={as}
                            name={`Node Instances (${instancesCount})`}
                            value={<NodeInstancesSummary instancesStates={instancesStates} />}
                            subHeaderStyle={{ lineHeight: `${big ? '1' : '2'}rem` }}
                        />
                    </Grid.Column>
                )}
                {customActions && <Grid.Column width={1}>{customActions}</Grid.Column>}
            </Grid.Row>
        </Grid>
    );
}
