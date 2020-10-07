/**
 * Created by jakub.niezgoda on 31/07/2018.
 */

import StepActions from '../wizard/StepActions';
import { createWizardStep } from '../wizard/wizardUtils';
import StepContentPropTypes from './StepContentPropTypes';

const infrastructureStepId = 'infrastructure';

class InfrastructureStepActions extends React.Component {
    onNext = id => {
        const { fetchData, onError, onLoading, onNext, toolbox } = this.props;
        let fetchedStepData = {};

        onLoading()
            .then(fetchData)
            .then(({ stepData }) => (fetchedStepData = stepData))
            .then(stepData =>
                toolbox.getInternal().doPut('source/list/resources', {
                    yamlFile: stepData.blueprintFileName,
                    url: stepData.blueprintUrl
                })
            )
            .then(resources => onNext(id, { blueprint: { ...resources, ...fetchedStepData } }))
            .catch(() => onError(id, 'Error during fetching data for the next step'));
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
            toolbox,
            id
        } = this.props;
        return (
            <StepActions
                id={id}
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

InfrastructureStepActions.propTypes = StepActions.propTypes;

class InfrastructureStepContent extends React.Component {
    static defaultBlueprintName = 'hello-world';

    static defaultBlueprintYaml = 'aws.yaml';

    static defaultInfrastractureState = {
        blueprintUrl: Stage.Common.Consts.externalUrls.helloWorldBlueprint,
        blueprintFile: null,
        blueprintName: InfrastructureStepContent.defaultBlueprintName,
        blueprintFileName: InfrastructureStepContent.defaultBlueprintYaml,
        imageUrl: '',
        imageFile: null,
        visibility: Stage.Common.Consts.defaultVisibility
    };

    componentDidMount() {
        const { id, onChange, stepData } = this.props;
        onChange(id, { ...InfrastructureStepContent.defaultInfrastractureState, ...stepData });
    }

    handleBlueprintChange(blueprintFileName) {
        const { id, onChange, stepData } = this.props;
        onChange(id, { ...stepData, blueprintFileName });
    }

    render() {
        const { Button, Form, Image } = Stage.Basic;
        const { widgetResourceUrl } = Stage.Utils.Url;
        const { loading, stepData } = this.props;

        const platformsYaml = ['aws.yaml', 'gcp.yaml', 'openstack.yaml', 'azure.yaml'];

        const PlatformButton = props => {
            const platformLogoSrc = yaml =>
                widgetResourceUrl('deploymentWizardButtons', `/images/${_.replace(yaml, '.yaml', '')}_logo.svg`, false);

            return (
                <Button
                    fluid
                    basic
                    size="huge"
                    active={props.active}
                    name={props.value}
                    onClick={() => this.handleBlueprintChange(props.value)}
                >
                    <Image src={platformLogoSrc(props.value)} inline style={{ cursor: 'pointer', height: 35 }} />
                </Button>
            );
        };

        return (
            <Form loading={loading}>
                {_.map(_.chunk(platformsYaml, 2), (group, index) => (
                    <Form.Group key={`platformGroup${index}`} widths="equal">
                        {_.map(group, yaml => (
                            <Form.Field key={yaml}>
                                <PlatformButton value={yaml} active={stepData.blueprintFileName === yaml} />
                            </Form.Field>
                        ))}
                    </Form.Group>
                ))}
            </Form>
        );
    }
}

InfrastructureStepContent.propTypes = StepContentPropTypes;

export default createWizardStep(
    infrastructureStepId,
    'Infrastructure',
    'Select IaaS Provider',
    InfrastructureStepContent,
    InfrastructureStepActions
);
