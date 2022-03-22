import type { FunctionComponent } from 'react';
import type { FullBlueprintData } from '../blueprints/BlueprintActions';
import DataTypesButton from '../inputs/DataTypesButton';
import YamlFileButton from '../inputs/YamlFileButton';
import type { Field } from '../types';
import InputsHelpIcon from '../inputs/InputsHelpIcon';
import getInputFields from '../inputs/utils/getInputFields';

const t = Stage.Utils.getT('widgets.common.deployments.deployModal');

interface Props {
    blueprint: FullBlueprintData;
    onYamlFileChange: (file: File) => void;
    fileLoading: boolean;
    onDeploymentInputChange: (event: React.SyntheticEvent, field: Field) => void;
    deploymentInputs: { [key: string]: unknown };
    errors: Record<string, string>;
}

const DeploymentInputs: FunctionComponent<Props> = ({
    blueprint,
    onYamlFileChange,
    fileLoading,
    onDeploymentInputChange,
    deploymentInputs,
    errors
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

            {getInputFields(
                blueprint.plan.inputs,
                onDeploymentInputChange,
                deploymentInputs,
                errors,
                blueprint.plan.data_types
            )}
        </>
    );
};

export default DeploymentInputs;
