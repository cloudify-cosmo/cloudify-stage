// @ts-nocheck File not migrated fully to TS
import type { FunctionComponent } from 'react';

const t = Stage.Utils.getT('widgets.common.deployments.deployModal');

type File = (Blob & { name: string }) | Record<string, any>;

interface Props {
    blueprint: Stage.Common.FullBlueprintData;
    handleYamlFileChange: (file: File) => void;
    fileLoading: boolean;
    handleDeploymentInputChange: (proxy: React.ChangeEvent, field: unknown) => void;
    deploymentInputs: { [key: string]: string | boolean | number };
    errors: { title: string };
}

const DeplomentInputsSection: FunctionComponent<Props> = ({
    blueprint,
    handleYamlFileChange,
    fileLoading,
    handleDeploymentInputChange,
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
                            onChange={handleYamlFileChange}
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
                handleDeploymentInputChange,
                deploymentInputs,
                errors,
                blueprint.plan.data_types
            )}
        </>
    );
};

export default DeplomentInputsSection;
