import type { FunctionComponent } from 'react';
import type { FullBlueprintData } from '../blueprints/BlueprintActions';
import DataTypesButton from '../inputs/DataTypesButton';
import InputsHelpIcon from '../inputs/InputsHelpIcon';
import InputFields from '../inputs/InputFields';
import type { OnChange } from '../inputs/types';
import YamlFileButton from '../inputs/YamlFileButton';

const t = Stage.Utils.getT('widgets.common.deployments.deployModal');

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
    const { Message } = Stage.Basic;
    const deploymentHasInputs = !_.isEmpty(blueprint.plan.inputs);
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
                    {!_.isEmpty(blueprint.plan.data_types) && (
                        <DataTypesButton iconButton types={blueprint.plan.data_types} />
                    )}
                    {deploymentHasInputs ? (
                        <InputsHelpIcon />
                    ) : (
                        <Message content={t('inputs.deploymentInputs.noInputs')} />
                    )}
                </>
            )}

            <InputFields
                inputs={blueprint.plan.inputs}
                onChange={onDeploymentInputChange}
                inputsState={deploymentInputs}
                errorsState={errors}
                toolbox={toolbox}
                dataTypes={blueprint.plan.data_types}
            />
        </>
    );
};

export default DeploymentInputs;
