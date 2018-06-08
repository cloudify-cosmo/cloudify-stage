/**
 * Created by pposel on 23/01/2017.
 */
import PropTypes from 'prop-types';

import React, { Component } from 'react';
import { Button, Input } from 'semantic-ui-react';

/**
 * InputFile is a component showing file input field
 *
 * ## Access
 * `Stage.Basic.Form.File`
 *
 * ## Usage
 * ![InputFile](manual/asset/form/InputFile_0.png)
 *
 * ```
 * <Form errors={this.state.errors} ref="installForm" loading={this.state.loading}>
 *   <Form.Field width="8" error={this.state.errors.widgetUrl}>
 *     <Form.File placeholder="Select widget file" name="widgetFile" ref="widgetFile"/>
 *   </Form.Field>
 * </Form>
 * ```
 *
 */
export default class InputFile extends Component {

    constructor(props,context) {
        super(props,context);

        this.state = {
            value: '',
            title: ''
        }
    }

    /**
     * propTypes
     * @property {string} [name] name of the field appended to 'fileName' string
     * @property {string} [placeholder=''] specifies a short hint that describes the expected input
     * @property {function} [onChange=(function () {});] function called on file change
     * @property {function} [onReset=(function () {});] function called on file reset
     * @property {boolean} [loading=false] if set to true opening file selector will be disabled
     * @property {boolean} [disabled=false] if set to true component will be disabled
     * @property {boolean} [showInput=true] if set to false input string field will not be presented
     */
    static propTypes = {
        name: PropTypes.string,
        placeholder: PropTypes.string,
        onChange: PropTypes.func,
        onReset: PropTypes.func,
        loading: PropTypes.bool,
        disabled: PropTypes.bool,
        showInput: PropTypes.bool
    };

    static defaultProps = {
        name: '',
        placeholder: '',
        onChange: () => {},
        onReset: () => {},
        loading: false,
        disabled: false,
        showInput: true
    }

    _openFileSelection(e) {
        e.preventDefault();
        this.refs.inputFile.click();
        return false;
    }

    _resetFileSelection(e) {
        e.preventDefault();
        this.reset();
        this.props.onReset();
        return false;
    }

    _fileChanged(e){
        var fullPathFileName = $(e.currentTarget).val();
        if (!fullPathFileName) {
            this.reset();
            return;
        }

        var filename = fullPathFileName.split('\\').pop();
        this.setState({value: filename, title: fullPathFileName});
        this.props.onChange(this.file(), filename);
    }

    file() {
        return this.refs.inputFile.files[0];
    }

    reset() {
        $(this.refs.inputFile).val('');
        this.setState({value: '', title: ''});
        this.props.onChange(null, '');
    }

    render() {
        return (
            this.props.showInput
            ?
                <React.Fragment>
                    <Input type="text" readOnly='true' value={this.state.value} title={this.state.title}
                       name={'fileName' + this.props.name} placeholder={this.props.placeholder}
                       onClick={this._openFileSelection.bind(this)} disabled={this.props.disabled} action>
                        <input />
                        <Button icon="folder open" loading={this.props.loading} onClick={this._openFileSelection.bind(this)} disabled={this.props.disabled}/>
                        <Button icon="remove" onClick={this._resetFileSelection.bind(this)} disabled={!this.state.value || this.props.disabled}/>
                    </Input>
                    <input type="file" name={this.props.name} hidden onChange={this._fileChanged.bind(this)} ref="inputFile" />
                </React.Fragment>
            :
                <React.Fragment>
                    <Button icon="folder open" loading={this.props.loading} onClick={this._openFileSelection.bind(this)} disabled={this.props.disabled}/>
                    <Button icon="remove" onClick={this._resetFileSelection.bind(this)} disabled={!this.state.value || this.props.disabled}/>
                    <input type="file" name={this.props.name} hidden onChange={this._fileChanged.bind(this)} ref="inputFile" />
                </React.Fragment>
        )
    }
}
