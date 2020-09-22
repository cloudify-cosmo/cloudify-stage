/**
 * Created by jakub.niezgoda on 10/08/2018.
 */

import { createWizardStep } from '../wizard/wizardUtils';
import StepActions from '../wizard/StepActions';
import StepContentPropTypes from './StepContentPropTypes';

const blueprintStepId = 'blueprint';

class BlueprintStepActions extends React.Component {
    constructor(props) {
        super(props);
    }

    onNext = id => {
        const { fetchData, onError, onLoading, onNext, toolbox } = this.props;
        let fetchedStepData = {};

        onLoading()
            .then(fetchData)
            .then(({ stepData }) => {
                fetchedStepData = stepData;
                const blueprintUrl = stepData.blueprintFile ? '' : stepData.blueprintUrl;
                const imageUrl = stepData.imageFile ? '' : stepData.imageUrl;
                const errors = {};

                if (!stepData.blueprintFile) {
                    if (_.isEmpty(blueprintUrl) || !Stage.Utils.Url.isUrl(blueprintUrl)) {
                        errors.blueprintUrl = 'Blueprint package';
                    }
                }

                if (_.isEmpty(stepData.blueprintName)) {
                    errors.blueprintName = 'Blueprint name';
                }

                if (_.isEmpty(stepData.blueprintFileName)) {
                    errors.blueprintFileName = 'Blueprint YAML file';
                }

                if (!_.isEmpty(imageUrl) && !Stage.Utils.Url.isUrl(imageUrl)) {
                    errors.imageUrl = 'Blueprint icon';
                }

                if (!_.isEmpty(errors)) {
                    return Promise.reject({
                        message: `Please fill in the following fields with valid values: ${_.values(errors).join(
                            ', '
                        )}.`,
                        errors
                    });
                }
                if (!_.isNil(stepData.blueprintFile)) {
                    return toolbox
                        .getInternal()
                        .doUpload(
                            'source/list/resources',
                            { yamlFile: stepData.blueprintFileName },
                            { archive: stepData.blueprintFile }
                        );
                }
                return toolbox.getInternal().doPut('source/list/resources', {
                    yamlFile: stepData.blueprintFileName,
                    url: stepData.blueprintUrl
                });
            })
            .then(resources => onNext(id, { blueprint: { ...resources, ...fetchedStepData } }))
            .catch(error => onError(id, error.message, error.errors));
    };

    render() {
        const {
            onClose,
            onStartOver,
            onPrev,
            onError,
            onLoading,
            onReady,
            disabled,
            showPrev,
            fetchData,
            wizardData,
            toolbox
        } = this.props;
        return (
            <StepActions
                onClose={onClose}
                onStartOver={onStartOver}
                onPrev={onPrev}
                onError={onError}
                onLoading={onLoading}
                onReady={onReady}
                disabled={disabled}
                showPrev={showPrev}
                fetchData={fetchData}
                wizardData={wizardData}
                toolbox={toolbox}
                onNext={this.onNext}
            />
        );
    }
}

BlueprintStepActions.propTypes = StepActions.propTypes;

class BlueprintStepContent extends React.Component {
    static defaultBlueprintState = {
        blueprintUrl: '',
        blueprintFile: null,
        blueprintName: '',
        blueprintFileName: '',
        imageUrl: '',
        imageFile: null,
        visibility: Stage.Common.Consts.defaultVisibility
    };

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        const { id, onChange, stepData } = this.props;
        onChange(id, { ...BlueprintStepContent.defaultBlueprintState, ...stepData });
    }

    handleBlueprintChange = fields => {
        const { id, onChange, stepData } = this.props;
        onChange(id, { ...stepData, ...fields });
    };

    render() {
        const { errors, loading, stepData, toolbox } = this.props;
        const { Container, VisibilityField } = Stage.Basic;
        const { UploadBlueprintForm } = Stage.Common;

        return !_.isEmpty(stepData) ? (
            <>
                <Container textAlign="right">
                    <VisibilityField
                        visibility={stepData.visibility}
                        className="large"
                        onVisibilityChange={visibility => this.handleBlueprintChange({ visibility })}
                    />
                </Container>
                <UploadBlueprintForm
                    blueprintUrl={stepData.blueprintUrl}
                    blueprintFile={stepData.blueprintFile}
                    blueprintName={stepData.blueprintName}
                    blueprintFileName={stepData.blueprintFileName}
                    imageUrl={stepData.imageUrl}
                    imageFile={stepData.imageFile}
                    loading={loading}
                    errors={errors}
                    showErrorsSummary={false}
                    onChange={this.handleBlueprintChange}
                    toolbox={toolbox}
                />
            </>
        ) : null;
    }
}

BlueprintStepContent.propTypes = StepContentPropTypes;

export default createWizardStep(
    blueprintStepId,
    'Blueprint',
    'Select blueprint',
    BlueprintStepContent,
    BlueprintStepActions
);
