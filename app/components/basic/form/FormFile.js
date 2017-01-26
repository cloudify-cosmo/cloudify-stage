/**
 * Created by pposel on 23/01/2017.
 */

import React, { Component, PropTypes } from 'react';

export default class FormFile extends Component {

    constructor(props,context) {
        super(props,context);

        this.state = {
            value: "",
            title: ""
        }
    }

    static propTypes = {
        placeholder: PropTypes.string,
        name: PropTypes.string
    };

    _openFileSelection(e) {
        e.preventDefault();
        this.refs.inputFile.click();
        return false;
    }

    _fileChanged(e){
        var fullPathFileName = $(e.currentTarget).val();
        if (!fullPathFileName) {
            return;
        }

        var filename = fullPathFileName.split('\\').pop();
        this.setState({value: filename, title: fullPathFileName});
    }

    file() {
        return this.refs.inputFile.files[0];
    }

    reset() {
        $(this.refs.inputFile).val("");
        this.setState({value: "", title: ""});
    }

    render() {
        return (
            <div>
                <div className="ui action input">
                    <input type="text" readOnly='true' value={this.state.value} title={this.state.title}
                           name={"fileName" + this.props.name} placeholder={this.props.placeholder}
                           onClick={this._openFileSelection.bind(this)}/>

                    <button className="ui icon button" onClick={this._openFileSelection.bind(this)}>
                        <i className="attach icon"></i>
                    </button>
                </div>

                <input type="file" name={this.props.name} style={{"display": "none"}} onChange={this._fileChanged.bind(this)} ref="inputFile"/>
            </div>
        );
    }
}
