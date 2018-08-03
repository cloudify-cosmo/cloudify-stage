/**
 * Created by jakub.niezgoda on 31/07/2018.
 */

import React, { Component } from 'react';

const infrastructureStepId = 'infrastructure';

class InfrastructureActions extends Component {
    constructor(props, context) {
        super(props);

        this.state = {
            loading: false
        }
    }

    static propTypes = Stage.Basic.Wizard.Step.Actions.propTypes;

    onNext(id) {
        this.props.onLoading(id, () =>
            this.props.fetchData()
                .then((data) => this.props.toolbox.getInternal()
                    .doPut('source/list/resources', {
                        yamlFile: data.stepData.blueprintYaml,
                        url: data.stepData.blueprintUrl
                    }))
                .then((resources) => this.props.onReady(id, () => this.props.onNext(id, resources)))
                .catch((error) => this.props.onError(id, error))
        )
    }

    render() {
        let {Wizard} = Stage.Basic;
        return <Wizard.Step.Actions {...this.props} onNext={this.onNext.bind(this)} />
    }
}

class InfrastructureContent extends Component {
    constructor(props, context) {
        super(props);

        this.state = InfrastructureContent.initialState;
    }

    static helloWorldBlueprintUrl = 'https://github.com/cloudify-examples/hello-world-blueprint/archive/master.zip';
    static defaultBlueprintYaml = 'aws.yaml';
    static initialState = {
        stepData: {
            blueprintName: '',
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
        let {Form, Image, Radio, Wizard} = Stage.Basic;
        const {widgetResourceUrl} = Stage.Utils;

        const PlatformRadio = (props) => {
            const blueprintYaml = `${props.value}.yaml`;
            const logoFile = `${props.value}_logo.svg`;

            return (
                <span>
                    <Radio label=' ' name='blueprintYaml' value={blueprintYaml}
                           checked={this.state.stepData.blueprintYaml === blueprintYaml}
                           onChange={this.onChange.bind(this, blueprintYaml)} />
                    <Image src={widgetResourceUrl('deploymentWizardButtons', `/images/${logoFile}`, false)}
                           inline style={{ cursor: 'pointer', height: 35 }}
                           onClick={this.onChange.bind(this, blueprintYaml)} />
                </span>
            );
        };

        return (
            <Wizard.Step.Content {...this.props}>
                <Form.Group widths='equal'>
                    <Form.Field>
                        <PlatformRadio value='aws' />
                    </Form.Field>
                    <Form.Field>
                        <PlatformRadio value='azure' />
                    </Form.Field>
                </Form.Group>
                <Form.Group widths='equal'>
                    <Form.Field>
                        <PlatformRadio value='gcp' />
                    </Form.Field>
                    <Form.Field>
                        <PlatformRadio value='openstack' />
                    </Form.Field>
                </Form.Group>
            </Wizard.Step.Content>
        );
    }
}

export default Stage.Basic.Wizard.Utils.createWizardStep(infrastructureStepId, 'Infrastructure', 'Select IaaS Provider', InfrastructureContent, InfrastructureActions);