/**
 * Created by pposel on 23/01/2017.
 */
import {Button} from 'semantic-ui-react'
import React, { Component, PropTypes } from 'react';

export default class InputFile extends Component {

    constructor(props,context) {
        super(props,context);

        this.state = {
            value: "",
            title: ""
        }
    }

    static propTypes = {
        placeholder: PropTypes.string,
        name: PropTypes.string,
        onChange: PropTypes.func,
        loading: PropTypes.bool,
        disabled: PropTypes.bool
    };

    static defaultProps = {
        onChange: () => {}
    }

    _openFileSelection(e) {
        e.preventDefault();
        this.refs.inputFile.click();
        return false;
    }

    _resetFileSelection(e) {
        e.preventDefault();
        this.reset();
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
        $(this.refs.inputFile).val("");
        this.setState({value: "", title: ""});
        this.props.onChange(null, "");
    }

    render() {
        return (
            <div>
                <div className={`ui action input ${this.props.disabled?'disabled':''}`}>
                    <input type="text" readOnly='true' value={this.state.value} title={this.state.title}
                           name={"fileName" + this.props.name} placeholder={this.props.placeholder}
                           onClick={this._openFileSelection.bind(this)}/>


                    <Button icon="attach" loading={this.props.loading} onClick={this._openFileSelection.bind(this)} disabled={this.props.disabled}/>
                    {
                        this.state.value &&
                        <Button icon="remove" onClick={this._resetFileSelection.bind(this)} disabled={this.props.disabled}/>
                    }
                </div>

                <input type="file" name={this.props.name} style={{"display": "none"}} onChange={this._fileChanged.bind(this)} ref="inputFile"/>
            </div>
        );
    }
}
