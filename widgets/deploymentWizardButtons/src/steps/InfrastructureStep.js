/**
 * Created by jakub.niezgoda on 31/07/2018.
 */

import React, { Component } from 'react';

const infrastructureStepId = 'infrastructure';

class InfrastructureActions extends Component {
    static propTypes = Stage.Basic.Wizard.Step.Actions.propTypes;

    onNext(id) {
        let fetchedStepData = {};

        this.props.onLoading()
            .then(this.props.fetchData)
            .then(({stepData}) => fetchedStepData = stepData)
            .then((stepData) =>
                this.props.toolbox.getInternal()
                    .doPut('source/list/resources', {
                        yamlFile: stepData.blueprintYaml,
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

class InfrastructureContent extends Component {
    constructor(props) {
        super(props);

        this.state = InfrastructureContent.initialState;
    }

    static defaultBlueprintName = 'hello-world';
    static helloWorldBlueprintUrl = 'https://github.com/cloudify-examples/hello-world-blueprint/archive/master.zip';
    static defaultBlueprintYaml = 'aws.yaml';

    static initialState = {
        stepData: {
            blueprintName: InfrastructureContent.defaultBlueprintName,
            blueprintUrl: InfrastructureContent.helloWorldBlueprintUrl,
            blueprintYaml: InfrastructureContent.defaultBlueprintYaml,
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

    onChange(blueprintYaml) {
        this.setState({stepData: {...this.state.stepData, blueprintYaml}},
            () => this.props.onChange(this.props.id, this.state.stepData));
    }

    render() {
        let {Button, Form, Image, Wizard} = Stage.Basic;
        const {widgetResourceUrl} = Stage.Utils;

        const blueprintYaml = this.state.stepData.blueprintYaml;
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
            <Wizard.Step.Content {...this.props}>
                {
                    _.map(_.chunk(platformsYaml, 2), (group, index) =>
                         <Form.Group key={`platformGroup${index}`} widths='equal'>
                             {
                                 _.map(group, (yaml) =>
                                     <Form.Field key={yaml}>
                                         <PlatformButton value={yaml} active={blueprintYaml === yaml} />
                                     </Form.Field>
                                 )
                             }
                         </Form.Group>
                     )
                }
            </Wizard.Step.Content>
        );
    }
}

export default Stage.Basic.Wizard.Utils.createWizardStep(infrastructureStepId, 'Infrastructure', 'Select IaaS Provider', InfrastructureContent, InfrastructureActions);