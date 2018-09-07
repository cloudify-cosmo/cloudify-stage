/**
 * Created by jakub.niezgoda on 17/08/2018.
 */

import React from 'react';
import PropTypes from 'prop-types';

class UploadPluginForm extends React.Component {

    constructor(props) {
        super(props);

        this.wagonFileRef = React.createRef();
        this.yamlFileRef = React.createRef();
    }

    static propTypes = {
        wagonUrl: PropTypes.string,
        wagonFile: PropTypes.object,
        wagonPlaceholder: PropTypes.string,
        yamlUrl: PropTypes.string,
        yamlFile: PropTypes.object,
        yamlPlaceholder: PropTypes.string,
        errors: PropTypes.object,
        onChange: PropTypes.func.isRequired,
        wrapInForm: PropTypes.bool
    };

    static defaultProps = {
        wagonUrl: '',
        wagonFile: null,
        wagonPlaceholder: 'Provide the plugin\'s wagon file URL or click browse to select a file',
        yamlUrl: '',
        yamlFile: null,
        yamlPlaceholder: 'Provide the plugin\'s YAML file URL or click browse to select a file',
        errors: {},
        wrapInForm: true
    };

    static NO_ERRORS = {errors: {}};

    componentDidMount() {
        this.wagonFileRef.current && this.wagonFileRef.current.reset();
        this.yamlFileRef.current && this.yamlFileRef.current.reset();
        this.resetErrors();
    }

    resetErrors() {
        this.props.onChange(UploadPluginForm.NO_ERRORS);
    }

    _handleInputChange(proxy, field) {
        this.props.onChange({...UploadPluginForm.NO_ERRORS, ...Stage.Basic.Form.fieldNameValue(field)});
    }

    _onWagonUrlFocus() {
        if (this.props.wagonFile) {
            this.wagonFileRef.current && this.wagonFileRef.current.reset();
            this._onWagonFileReset();
        }
    }

    _onWagonFileChange(file) {
        this.props.onChange({...UploadPluginForm.NO_ERRORS, wagonFile: file ? file : null, wagonUrl: file ? file.name : ''});
    }

    _onWagonFileReset() {
        this.props.onChange({...UploadPluginForm.NO_ERRORS, wagonFile: null, wagonUrl: ''});
    }

    _onYamlUrlFocus() {
        if (this.props.yamlFile) {
            this.yamlFileRef.current && this.yamlFileRef.current.reset();
            this._onYamlFileReset();
        }
    }

    _onYamlFileChange(file) {
        this.props.onChange({...UploadPluginForm.NO_ERRORS, yamlFile: file ? file : null, yamlUrl: file ? file.name : ''});
    }

    _onYamlFileReset() {
        this.props.onChange({...UploadPluginForm.NO_ERRORS, yamlFile: null, yamlUrl: ''});
    }

    render() {
        let {Container, Form, Label} = Stage.Basic;

        const formFields = [
            <Form.Field label="Wagon file" required key='wagon'
                        error={this.props.errors.wagonUrl}>
                <Form.UrlOrFile name="wagon" value={this.props.wagonUrl}
                                placeholder={this.props.wagonPlaceholder}
                                onChangeUrl={this._handleInputChange.bind(this)}
                                onFocusUrl={this._onWagonUrlFocus.bind(this)}
                                onBlurUrl={_.noop}
                                onChangeFile={this._onWagonFileChange.bind(this)}
                                onResetFile={this._onWagonFileReset.bind(this)}
                                label={<Label>{!this.props.wagonFile ? 'URL' : 'File'}</Label>}
                                fileInputRef={this.wagonFileRef}
                />
            </Form.Field>
            ,
            <Form.Field label="YAML file" required key='yaml'
                        error={this.props.errors.yamlUrl}>
                <Form.UrlOrFile name="yaml" value={this.props.yamlUrl}
                    placeholder={this.props.yamlPlaceholder}
                    onChangeUrl={this._handleInputChange.bind(this)}
                    onFocusUrl={this._onYamlUrlFocus.bind(this)}
                    onBlurUrl={_.noop}
                    onChangeFile={this._onYamlFileChange.bind(this)}
                    onResetFile={this._onYamlFileReset.bind(this)}
                    label={<Label>{!this.props.yamlFile ? 'URL' : 'File'}</Label>}
                    fileInputRef={this.yamlFileRef}
                    />
            </Form.Field>
        ];

        if (this.props.wrapInForm) {
            return (
                <Form errors={this.props.errors} onErrorsDismiss={this.resetErrors.bind(this)}>
                    {formFields}
                </Form>
            );
        } else {
            return (
                <Container fluid>
                    {formFields}
                </Container>
            );
        }

    }
}

Stage.defineCommon({
    name: 'UploadPluginForm',
    common: UploadPluginForm
});
