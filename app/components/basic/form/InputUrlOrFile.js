/**
 * Created by jakub.niezgoda on 08/06/2018.
 */
import PropTypes from 'prop-types';

import React, { Component } from 'react';
import { Input } from 'semantic-ui-react';
import InputFile from './InputFile';

/**
 * InputUrlOrFile is a component showing URL and file input field
 *
 * ## Access
 * `Stage.Basic.Form.UrlOrFile`
 *
 * ## Usage
 * ![InputUrlOrFile](manual/asset/form/InputUrlOrFile_0.png)
 *
 * ```
 * <Form.UrlOrFile name="blueprint" value={this.state.blueprintUrl}
 *                 placeholder="Provide the blueprint's URL or click browse to select a file"
 *                 onChangeUrl={this._handleInputChange.bind(this)}
 *                 onFocusUrl={this._onBlueprintUrlFocus.bind(this)}
 *                 onBlurUrl={this._onBlueprintUrlBlur.bind(this)}
 *                 onChangeFile={this._onBlueprintFileChange.bind(this)}
 *                 onResetFile={this._onBlueprintFileReset.bind(this)}
 *                 label={<Label>{this.state.isBlueprintUrlUsed ? 'URL' : 'File'}</Label>}
*  />
 * ```
 */
export default class InputUrlOrFile extends Component {

    constructor(props,context) {
        super(props,context);
    }

    /**
     * propTypes
     * @property {string} name basename of the field => URL field will be named `<name>Url` and file field will be named `<name>File`
     * @property {string} value text input field value
     * @property {string} placeholder input field placeholder
     * @property {any} [label=null] label to be added to URL input field on the left side
     * @property {function} onChangeUrl function to be called on URL change
     * @property {function} onFocusUrl function to be called on URL input focus
     * @property {function} onBlurUrl function to be called on URL input blur
     * @property {function} onChangeFile function to be called on file change
     * @property {function} onResetFile function to be called on file reset
     * @property {object} fileInputRef ref attached to file input
     */
    static propTypes = {
        name: PropTypes.string.isRequired,
        value: PropTypes.string.isRequired,
        placeholder: PropTypes.string.isRequired,
        label: PropTypes.any,
        onChangeUrl: PropTypes.func.isRequired,
        onFocusUrl: PropTypes.func.isRequired,
        onBlurUrl: PropTypes.func.isRequired,
        onChangeFile: PropTypes.func.isRequired,
        onResetFile: PropTypes.func.isRequired,
        fileInputRef: PropTypes.object
    };

    static defaultProps = {
        label: null,
        fileInputRef: null
    };

    render() {
        return (
            <Input value={this.props.value} name={`${this.props.name}Url`}
                   placeholder={this.props.placeholder}
                   onChange={this.props.onChangeUrl}
                   onFocus={this.props.onFocusUrl}
                   onBlur={this.props.onBlurUrl}
                   action labelPosition='left'>
                {this.props.label}
                <input />
                <InputFile name={`${this.props.name}File`} ref={this.props.fileInputRef}
                           onChange={this.props.onChangeFile}
                           onReset={this.props.onResetFile}
                           showInput={false} />
            </Input>
        )
    }
}

