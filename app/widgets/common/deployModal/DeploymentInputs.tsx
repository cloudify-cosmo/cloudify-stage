import type { FunctionComponent } from 'react';
import React, { useState } from 'react';
import { isEmpty } from 'lodash';
import type { FullBlueprintData } from '../blueprints/BlueprintActions';
import DataTypesButton from '../inputs/DataTypesButton';
import InputsHelpIcon from '../inputs/InputsHelpIcon';
import type { SortOrder } from '../inputs/SortOrderIcons';
import SortOrderIcons from '../inputs/SortOrderIcons';
import InputFields from '../inputs/InputFields';
import type { OnChange } from '../inputs/types';
import YamlFileButton from '../inputs/YamlFileButton';
import StageUtils from '../../../utils/stageUtils';
import { Message } from '../../../components/basic';

const t = StageUtils.getT('widgets.common.deployments.deployModal');

interface Props {
    blueprint: FullBlueprintData;
    onYamlFileChange: (file: File) => void;
    fileLoading: boolean;
    onDeploymentInputChange: OnChange;
    deploymentInputs: { [key: string]: unknown };
    errors: Record<string, string>;
    toolbox: Stage.Types.Toolbox;
}

const DeploymentInputs: FunctionComponent<Props> = ({
    blueprint,
    onYamlFileChange,
    fileLoading,
    onDeploymentInputChange,
    deploymentInputs,
    errors,
    toolbox
}) => {
    const [sortOrder, setSortOrder] = useState<SortOrder>('original');
    const deploymentHasInputs = !isEmpty(blueprint.plan.inputs);
    const deploymentHasMultipleInputs = deploymentHasInputs && Object.keys(blueprint.plan.inputs).length > 1;
    const deploymentHasDataTypes = !isEmpty(blueprint.plan.data_types);

    return (
        <>
            {blueprint.id && (
                <>
                    {deploymentHasInputs && (
                        <YamlFileButton
                            onChange={onYamlFileChange}
                            dataType="deployment's inputs"
                            fileLoading={fileLoading}
                            iconButton
                        />
                    )}
                    {deploymentHasDataTypes && <DataTypesButton iconButton types={blueprint.plan.data_types} />}
                    {deploymentHasInputs ? (
                        <InputsHelpIcon />
                    ) : (
                        <Message content={t('inputs.deploymentInputs.noInputs')} />
                    )}
                    {deploymentHasMultipleInputs && <SortOrderIcons selected={sortOrder} onChange={setSortOrder} />}
                </>
            )}

            <InputFields
                inputs={blueprint.plan.inputs}
                onChange={onDeploymentInputChange}
                inputsState={deploymentInputs}
                errorsState={errors}
                toolbox={toolbox}
                dataTypes={blueprint.plan.data_types}
                sortOrder={sortOrder}
            />
        </>
    );
};

export default DeploymentInputs;
