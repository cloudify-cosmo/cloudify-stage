/**
 * Created by pposel on 23/01/2017.
 */
import PropTypes from 'prop-types';

import React, { Component } from 'react';
import { Button, Input, Popup } from '../index';

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
    constructor(props, context) {
        super(props, context);

        this.inputRef = React.createRef();

        this.state = {
            value: '',
            title: ''
        };
    }

    /**
     * propTypes
     *
     * @property {string} [name] name of the field appended to 'fileName' string
     * @property {string} [placeholder=''] specifies a short hint that describes the expected input
     * @property {Function} [onChange=(function () {});] function called on file change
     * @property {Function} [onReset=(function () {});] function called on file reset
     * @property {boolean} [loading=false] if set to true opening file selector will be disabled
     * @property {boolean} [disabled=false] if set to true component will be disabled
     * @property {boolean} [showInput=true] if set to false input string field will not be presented
     * @property {boolean} [showReset=true] if set to false reset button will not be presented
     * @property {object} [openButtonParams={}] additional parameters for open file button, props for Button component
     * @property {string} [help=''] additional help information shown in Popup
     */
    static propTypes = {
        name: PropTypes.string,
        placeholder: PropTypes.string,
        onChange: PropTypes.func,
        onReset: PropTypes.func,
        loading: PropTypes.bool,
        disabled: PropTypes.bool,
        showInput: PropTypes.bool,
        showReset: PropTypes.bool,
        openButtonParams: PropTypes.object,
        help: PropTypes.string
    };

    static defaultProps = {
        name: '',
        placeholder: '',
        onChange: () => {},
        onReset: () => {},
        loading: false,
        disabled: false,
        showInput: true,
        showReset: true,
        openButtonParams: {},
        help: ''
    };

    _openFileSelection(e) {
        e.preventDefault();
        this.inputRef.current.click();
        return false;
    }

    _resetFileSelection(e) {
        e.preventDefault();
        this.reset();
        this.props.onReset();
        return false;
    }

    _fileChanged(e) {
        const fullPathFileName = $(e.currentTarget).val();
        if (!fullPathFileName) {
            this.reset();
            return;
        }

        const filename = fullPathFileName.split('\\').pop();
        this.setState({ value: filename, title: fullPathFileName });
        this.props.onChange(this.file(), filename);
        if (!this.props.showReset) {
            this._resetFileSelection(e);
        }
    }

    file() {
        return this.inputRef.current.files[0];
    }

    reset() {
        $(this.inputRef.current).val('');
        this.setState({ value: '', title: '' });
        this.props.onChange(null, '');
    }

    getOpenFolderButton() {
        const getOpenFolderButton = () => (
            <Button
                icon="folder open"
                onClick={this._openFileSelection.bind(this)}
                loading={this.props.loading}
                disabled={this.props.disabled}
                {...this.props.openButtonParams}
            />
        );

        return !_.isEmpty(this.props.help) ? (
            <Popup trigger={getOpenFolderButton()} content={this.props.help} />
        ) : (
            getOpenFolderButton()
        );
    }

    getResetFileButton() {
        return this.props.showReset ? (
            <Button
                icon="remove"
                onClick={this._resetFileSelection.bind(this)}
                disabled={!this.state.value || this.props.disabled}
            />
        ) : null;
    }

    getHiddenInput() {
        return (
            <input
                type="file"
                name={this.props.name}
                hidden
                onChange={this._fileChanged.bind(this)}
                ref={this.inputRef}
            />
        );
    }

    render() {
        return this.props.showInput ? (
            <>
                <Input
                    readOnly
                    value={this.state.value}
                    title={this.state.title}
                    name={`fileName${this.props.name}`}
                    placeholder={this.props.placeholder}
                    onClick={this._openFileSelection.bind(this)}
                    disabled={this.props.disabled}
                    action
                >
                    <input />
                    {this.getOpenFolderButton()}
                    {this.getResetFileButton()}
                </Input>
                {this.getHiddenInput()}
            </>
        ) : (
            <>
                {this.getOpenFolderButton()}
                {this.getResetFileButton()}
                {this.getHiddenInput()}
            </>
        );
    }
}
