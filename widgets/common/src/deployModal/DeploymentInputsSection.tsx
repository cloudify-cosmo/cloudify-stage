import type { FunctionComponent } from 'react';
import type { FullBlueprintData } from '../BlueprintActions';
import type { Field } from '../types';

const t = Stage.Utils.getT('widgets.common.deployments.deployModal');

interface Props {
    blueprint: FullBlueprintData;
    onYamlFileChange: (file: File) => void;
    fileLoading: boolean;
    onDeploymentInputChange: (event: React.ChangeEvent, field: Field) => void;
    deploymentInputs: { [key: string]: unknown };
    errors: Record<string, string>;
}

const DeplomentInputsSection: FunctionComponent<Props> = ({
    blueprint,
    onYamlFileChange,
    fileLoading,
    onDeploymentInputChange,
    deploymentInputs,
    errors
}) => {
    const { DataTypesButton, InputsHeader, YamlFileButton, InputsUtils } = Stage.Common;
    const { Message } = Stage.Basic;
    return (
        <>
            {blueprint.id && (
                <>
                    {!_.isEmpty(blueprint.plan.inputs) && (
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
                    <InputsHeader iconButton header="" />
                    {_.isEmpty(blueprint.plan.inputs) && <Message content={t('inputs.deploymentInputs.noInputs')} />}
                </>
            )}

            {InputsUtils.getInputFields(
                blueprint.plan.inputs,
                onDeploymentInputChange,
                deploymentInputs,
                errors,
                blueprint.plan.data_types
            )}
        </>
    );
};

export default DeplomentInputsSection;
