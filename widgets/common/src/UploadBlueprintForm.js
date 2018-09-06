/**
 * Created by kinneretzin on 05/10/2016.
 */

import PropTypes from 'prop-types';
import React from 'react';

class UploadBlueprintForm extends React.Component {

    constructor(props) {
        super(props);

        this.state = {...UploadBlueprintForm.initialState};

        this.blueprintFileRef = React.createRef();
        this.imageFileRef = React.createRef();

        this.actions = new Stage.Common.BlueprintActions(props.toolbox);
    }

    static propTypes = {
        blueprintUrl: PropTypes.string,
        blueprintFile: PropTypes.object,
        blueprintName: PropTypes.string,
        blueprintFileName: PropTypes.string,
        imageUrl: PropTypes.string,
        imageFile: PropTypes.object,
        errors: PropTypes.object,
        loading: PropTypes.bool,
        onChange: PropTypes.func.isRequired,
        toolbox: PropTypes.object.isRequired
    };

    static defaultProps = {
        blueprintUrl: '',
        blueprintFile: null,
        blueprintName: '',
        blueprintFileName: '',
        imageUrl: '',
        imageFile: null,
        errors: {},
        loading: false
    };

    static initialState = {
        loading: false,
        yamlFiles: []
    };

    static DEFAULT_BLUEPRINT_YAML_FILE = 'blueprint.yaml';
    static NO_ERRORS = {errors: {}};

    componentDidMount() {
        this.blueprintFileRef.current && this.blueprintFileRef.current.reset();
        this.imageFileRef.current && this.imageFileRef.current.reset();
        this.setState(UploadBlueprintForm.initialState);

        if (!_.isEmpty(this.props.blueprintUrl || !_.isNil(this.props.blueprintFile))) {
            this.setState({loading: true});
            this.actions.doListYamlFiles(this.props.blueprintUrl, this.props.blueprintFile, false)
                .then((data) => {
                    this.setState({yamlFiles: data, loading: false});
                }).catch((error) => {
                    this.setState({yamlFiles: [], loading: false});
                    this.props.onChange({errors: {error}});
                });
        }
    }

    _handleInputChange(proxy, field) {
        this.props.onChange({...UploadBlueprintForm.NO_ERRORS, ...Stage.Basic.Form.fieldNameValue(field)});
    }

    _onBlueprintUrlBlur() {
        if (!this.props.blueprintUrl) {
            this.setState({yamlFiles: []}, this.resetErrors);
            return;
        }

        this.setState({loading: true}, () => this.props.onChange({blueprintFile: null}));
        this.blueprintFileRef.current && this.blueprintFileRef.current.reset();

        this.actions.doListYamlFiles(this.props.blueprintUrl, null, true).then((data) => {
            this.setState({yamlFiles: data, loading: false}, () => {
                const blueprintName = data.shift();
                const blueprintFileName
                    = _.includes(data, UploadBlueprintForm.DEFAULT_BLUEPRINT_YAML_FILE)
                    ? UploadBlueprintForm.DEFAULT_BLUEPRINT_YAML_FILE
                    : data[0];
                this.props.onChange({...UploadBlueprintForm.NO_ERRORS, blueprintName, blueprintFileName});
            });
        }).catch((error) => {
            this.setState({loading: false}, () =>
                this.props.onChange({errors: {error: error.message}, blueprintName: '', blueprintFileName: ''})
            );
        });
    }

    _onBlueprintUrlFocus() {
        if (this.props.blueprintFile) {
            this.blueprintFileRef.current && this.blueprintFileRef.current.reset();
            this._onBlueprintFileReset();
        }
    }

    _onBlueprintFileChange(file) {
        if (!file) {
            this.setState({yamlFiles: []}, this.resetErrors);
            return;
        }

        this.setState({loading: true});
        this.actions.doListYamlFiles(null, file, true).then((data)=>{
            const blueprintName = data.shift();
            const blueprintFileName
                = _.includes(data, UploadBlueprintForm.DEFAULT_BLUEPRINT_YAML_FILE)
                ? UploadBlueprintForm.DEFAULT_BLUEPRINT_YAML_FILE
                : data[0];
            this.setState({yamlFiles: data, loading: false}, () => {
                this.props.onChange({...UploadBlueprintForm.NO_ERRORS, blueprintFile: file, blueprintUrl: file.name, blueprintName, blueprintFileName});
            });
        }).catch((error) => {
            this.setState({loading: false}, () =>
                this.props.onChange({errors: {error: error.message}, blueprintName: '', blueprintFileName: ''})
            );
        });
    }

    _onBlueprintFileReset() {
        this.setState({yamlFiles: []}, () =>
            this.props.onChange({...UploadBlueprintForm.NO_ERRORS, blueprintFile: null, blueprintUrl: '', blueprintName: '', blueprintFileName: ''})
        );
    }

    _onBlueprintImageUrlFocus() {
        if (this.props.imageFile) {
            this.imageFileRef.current && this.imageFileRef.current.reset();
            this._onBlueprintImageReset();
        }
    }

    _onBlueprintImageChange(file) {
        if (file) {
            this.props.onChange({...UploadBlueprintForm.NO_ERRORS, imageUrl: file.name, imageFile: file});
        }
    }

    _onBlueprintImageReset() {
        this.props.onChange({...UploadBlueprintForm.NO_ERRORS, imageUrl: '', imageFile: null});
    }
    
    resetErrors() {
        this.props.onChange(UploadBlueprintForm.NO_ERRORS);
    }
    
    render() {
        let {Form, Label} = Stage.Basic;
        let options = _.map(this.state.yamlFiles, item => { return {text: item, value: item} });

        return (
            <Form loading={this.state.loading || this.props.loading}
                  errors={this.props.errors} onErrorsDismiss={this.resetErrors.bind(this)}>

                <Form.Field label='Blueprint package' required
                            error={this.props.errors.blueprintUrl}
                            help='The archive package must contain exactly one directory
                                  that includes a yaml file for the main blueprint.'>
                    <Form.UrlOrFile name="blueprint" value={this.props.blueprintUrl}
                                    placeholder="Provide the blueprint's URL or click browse to select a file"
                                    onChangeUrl={this._handleInputChange.bind(this)}
                                    onFocusUrl={this._onBlueprintUrlFocus.bind(this)}
                                    onBlurUrl={this._onBlueprintUrlBlur.bind(this)}
                                    onChangeFile={this._onBlueprintFileChange.bind(this)}
                                    onResetFile={this._onBlueprintFileReset.bind(this)}
                                    label={<Label>{!this.props.blueprintFile ? 'URL' : 'File'}</Label>}
                                    fileInputRef={this.blueprintFileRef}
                    />
                </Form.Field>


                <Form.Field label='Blueprint name' required
                            error={this.props.errors.blueprintName}
                            help='The package is uploaded to the Manager as a blueprint with the name you specify here.'>
                    <Form.Input name='blueprintName'
                                value={this.props.blueprintName}
                                onChange={this._handleInputChange.bind(this)}/>
                </Form.Field>

                <Form.Field label='Blueprint YAML file' required
                            error={this.props.errors.blueprintFileName}
                            help='You must specify the blueprint yaml file for your environment
                                  because the archive can contain more than one yaml file.'>
                    <Form.Dropdown name="blueprintFileName" search selection options={options}
                                   value={this.props.blueprintFileName}
                                   onChange={this._handleInputChange.bind(this)} />
                </Form.Field>

                <Form.Field label='Blueprint icon'
                            error={this.props.errors.imageUrl}
                            help='(Optional) The blueprint icon file is shown with the blueprint in the local blueprint widget.'>
                    <Form.UrlOrFile name="image" value={this.props.imageUrl}
                                    placeholder="Provide the image file URL or click browse to select a file"
                                    onChangeUrl={this._handleInputChange.bind(this)}
                                    onFocusUrl={this._onBlueprintImageUrlFocus.bind(this)}
                                    onBlurUrl={_.noop}
                                    onChangeFile={this._onBlueprintImageChange.bind(this)}
                                    onResetFile={this._onBlueprintImageReset.bind(this)}
                                    label={<Label>{!this.props.imageFile ? 'URL' : 'File'}</Label>}
                                    fileInputRef={this.imageFileRef}
                    />
                </Form.Field>

            </Form>
        );
    }
}

Stage.defineCommon({
    name: 'UploadBlueprintForm',
    common: UploadBlueprintForm
});
