/**
 * Created by jakub.niezgoda on 31/07/2018.
 */

import React, { Component } from 'react';

const infrastructureStepId = 'infrastructure';
const {createWizardStep} = Stage.Basic.Wizard.Utils;

class InfrastructureStepActions extends Component {

    constructor(props) {
        super(props);
    }

    static propTypes = Stage.Basic.Wizard.Step.Actions.propTypes;

    onNext(id) {
        let fetchedStepData = {};

        this.props.onLoading()
            .then(this.props.fetchData)
            .then(({stepData}) => fetchedStepData = stepData)
            .then((stepData) =>
                this.props.toolbox.getInternal()
                    .doPut('source/list/resources', {
                        yamlFile: stepData.blueprintFileName,
                        url: stepData.blueprintUrl
                    }))
            .then((resources) => this.props.onNext(id, {blueprint: {...resources, ...fetchedStepData}}))
            .catch((error) => this.props.onError(error))
    }

    render() {
        let {Wizard} = Stage.Basic;
        return <Wizard.Step.Actions {...this.props} onNext={this.onNext.bind(this)} />
    }
}

class InfrastructureStepContent extends Component {

    constructor(props) {
        super(props);

        this.state = InfrastructureStepContent.initialState;
    }

    static defaultBlueprintName = 'hello-world';
    static helloWorldBlueprintUrl = 'https://github.com/cloudify-cosmo/cloudify-hello-world-example/archive/master.zip';
    static defaultBlueprintYaml = 'aws.yaml';

    static initialState = {
        stepData: {
            blueprintName: InfrastructureStepContent.defaultBlueprintName,
            blueprintUrl: InfrastructureStepContent.helloWorldBlueprintUrl,
            blueprintFileName: InfrastructureStepContent.defaultblueprintFileName,
            blueprintImageUrl: ''
        }
    };

    static propTypes = Stage.Basic.Wizard.Step.Content.propTypes;

    componentDidMount() {
        if (!_.isEmpty(this.props.stepData)) {
            this.setState({stepData: {...this.props.stepData}});
        } else {
            this.props.onChange(this.props.id, this.state.stepData);
        }
    }

    onChange(blueprintFileName) {
        this.setState({stepData: {...this.state.stepData, blueprintFileName}},
            () => this.props.onChange(this.props.id, this.state.stepData));
    }

    render() {
        let {Button, Form, Image} = Stage.Basic;
        const {widgetResourceUrl} = Stage.Utils;

        const blueprintFileName = this.state.stepData.blueprintFileName;
        const platformsYaml = ['aws.yaml', 'gcp.yaml', 'openstack.yaml', 'azure.yaml'];

        const PlatformButton = (props) => {
            const platformLogoSrc = (yaml) =>
                widgetResourceUrl('deploymentWizardButtons', `/images/${_.replace(yaml, '.yaml', '')}_logo.svg`, false);

            return (
                <Button fluid basic size='huge' active={props.active} onClick={this.onChange.bind(this, props.value)}>
                    <Image src={platformLogoSrc(props.value)} inline style={{ cursor: 'pointer', height: 35 }} />
                </Button>
            );
        };

        return (
            <Form loading={this.props.loading}>
                {
                    _.map(_.chunk(platformsYaml, 2), (group, index) =>
                         <Form.Group key={`platformGroup${index}`} widths='equal'>
                             {
                                 _.map(group, (yaml) =>
                                     <Form.Field key={yaml}>
                                         <PlatformButton value={yaml} active={blueprintFileName === yaml} />
                                     </Form.Field>
                                 )
                             }
                         </Form.Group>
                     )
                }
            </Form>
        );
    }
}

export default createWizardStep(infrastructureStepId,
                                'Infrastructure',
                                'Select IaaS Provider',
                                InfrastructureStepContent,
                                InfrastructureStepActions);
