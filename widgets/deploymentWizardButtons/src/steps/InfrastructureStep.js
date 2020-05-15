/**
 * Created by jakub.niezgoda on 31/07/2018.
 */

import { createWizardStep } from '../wizard/wizardUtils';
import StepActions from '../wizard/StepActions';
import StepContent from '../wizard/StepContent';

const infrastructureStepId = 'infrastructure';

class InfrastructureStepActions extends React.Component {
    constructor(props) {
        super(props);
    }

    static propTypes = StepActions.propTypes;

    onNext(id) {
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
    }

    render() {
        return <StepActions {...this.props} onNext={this.onNext.bind(this)} />;
    }
}

class InfrastructureStepContent extends React.Component {
    constructor(props) {
        super(props);

        this.state = InfrastructureStepContent.initialState;
    }

    static defaultBlueprintName = 'hello-world';

    static defaultBlueprintYaml = 'aws.yaml';

    static initialState = {
        stepData: {
            blueprintUrl: Stage.Common.Consts.externalUrls.helloWorldBlueprint,
            blueprintFile: null,
            blueprintName: InfrastructureStepContent.defaultBlueprintName,
            blueprintFileName: InfrastructureStepContent.defaultBlueprintYaml,
            imageUrl: '',
            imageFile: null,
            visibility: Stage.Common.Consts.defaultVisibility
        }
    };

    static propTypes = StepContent.propTypes;

    componentDidMount() {
        const { id, onChange, stepData } = this.props;
        if (!_.isEmpty(stepData)) {
            this.setState({ stepData: { ...stepData } });
        } else {
            onChange(id, this.state.stepData);
        }
    }

    onChange(blueprintFileName) {
        const { stepData } = this.state;
        const { id, onChange } = this.props;
        this.setState({ stepData: { ...stepData, blueprintFileName } }, () => onChange(id, stepData));
    }

    render() {
        const { Button, Form, Image } = Stage.Basic;
        const { widgetResourceUrl } = Stage.Utils.Url;

        const { blueprintFileName } = this.state.stepData;
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
                    onClick={this.onChange.bind(this, props.value)}
                >
                    <Image src={platformLogoSrc(props.value)} inline style={{ cursor: 'pointer', height: 35 }} />
                </Button>
            );
        };

        return (
            <Form loading={this.props.loading}>
                {_.map(_.chunk(platformsYaml, 2), (group, index) => (
                    <Form.Group key={`platformGroup${index}`} widths="equal">
                        {_.map(group, yaml => (
                            <Form.Field key={yaml}>
                                <PlatformButton value={yaml} active={blueprintFileName === yaml} />
                            </Form.Field>
                        ))}
                    </Form.Group>
                ))}
            </Form>
        );
    }
}

export default createWizardStep(
    infrastructureStepId,
    'Infrastructure',
    'Select IaaS Provider',
    InfrastructureStepContent,
    InfrastructureStepActions
);
