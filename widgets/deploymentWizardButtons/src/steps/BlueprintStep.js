/**
 * Created by jakub.niezgoda on 10/08/2018.
 */

import React, { Component } from 'react';

const blueprintStepId = 'blueprint';
const {createWizardStep} = Stage.Basic.Wizard.Utils;

class BlueprintStepActions extends Component {

    constructor(props) {
        super(props);
    }

    static propTypes = Stage.Basic.Wizard.Step.Actions.propTypes;

    onNext(id) {
        let fetchedStepData = {};

        this.props.onLoading()
            .then(this.props.fetchData)
            .then(({stepData}) => {
                fetchedStepData = stepData;
                const blueprintUrl = stepData.blueprintFile ? '' : stepData.blueprintUrl;
                let missingFields = [];

                if (_.isEmpty(blueprintUrl) && !stepData.blueprintFile) {
                    missingFields.push('Blueprint package');
                }

                if (_.isEmpty(stepData.blueprintName)) {
                    missingFields.push('Blueprint name');
                }

                if (_.isEmpty(stepData.blueprintFileName)) {
                    missingFields.push('Blueprint YAML file');
                }

                if (!_.isEmpty(missingFields)) {
                    return Promise.reject(`Please fill in the following fields: ${missingFields.join(', ')}.`);
                } else {
                    if (!_.isNil(stepData.blueprintFile)) {
                        return this.props.toolbox.getInternal()
                            .doUpload('source/list/resources',
                                      {yamlFile: stepData.blueprintFileName},
                                      {archive: stepData.blueprintFile});
                    } else {
                        return this.props.toolbox.getInternal()
                            .doPut('source/list/resources',
                                   {yamlFile: stepData.blueprintFileName, url: stepData.blueprintUrl});
                    }
                }
            }).then((resources) => this.props.onNext(id, {blueprint: {...resources, ...fetchedStepData}}))
            .catch((error) => this.props.onError(error))
    }

    render() {
        let {Wizard} = Stage.Basic;
        return <Wizard.Step.Actions {...this.props} onNext={this.onNext.bind(this)} />
    }
}

class BlueprintStepContent extends Component {

    constructor(props) {
        super(props);
    }

    static propTypes = Stage.Basic.Wizard.Step.Content.propTypes;

    static defaultBlueprintState = {
        blueprintUrl: '',
        blueprintFile: null,
        blueprintName: '',
        blueprintFileName: '',
        imageUrl: '',
        imageFile: null,
        visibility: Stage.Common.Consts.defaultVisibility
    };

    componentDidMount() {
        this.props.onChange(this.props.id, {...BlueprintStepContent.defaultBlueprintState, ...this.props.stepData});
    }

    onChange(fields) {
        this.props.onChange(this.props.id, {...this.props.stepData, ...fields});
    }

    render() {
        let {Container, VisibilityField} = Stage.Basic;
        let {UploadBlueprintForm} = Stage.Common;

        return !_.isEmpty(this.props.stepData)
            ?
                <React.Fragment>
                    <Container textAlign='right'>
                        <VisibilityField visibility={this.props.stepData.visibility} className='large'
                                         onVisibilityChange={(visibility) => this.onChange({visibility})} />
                    </Container>
                    <UploadBlueprintForm blueprintUrl={this.props.stepData.blueprintUrl}
                                         blueprintFile={this.props.stepData.blueprintFile}
                                         blueprintName={this.props.stepData.blueprintName}
                                         blueprintFileName={this.props.stepData.blueprintFileName}
                                         imageUrl={this.props.stepData.imageUrl}
                                         imageFile={this.props.stepData.imageFile}
                                         loading={this.props.loading}
                                         errors={this.props.stepData.errors}
                                         onChange={this.onChange.bind(this)}
                                         toolbox={this.props.toolbox} />
                </React.Fragment>
            :
                null;
    }
}

export default createWizardStep(blueprintStepId,
                                'Blueprint',
                                'Select blueprint',
                                BlueprintStepContent,
                                BlueprintStepActions);