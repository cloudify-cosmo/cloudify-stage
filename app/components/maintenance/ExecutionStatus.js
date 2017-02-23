/**
 * Created by jakubniezgoda on 27/01/2017.
 */

import React, {Component, PropTypes} from "react";
import {Dropdown, Label, Icon} from "../basic/index";

export default class extends Component {

    constructor(props,context) {
        super(props,context);

        this.state = {
            cancelClicked: false
        }
    }

    static propTypes = {
        item: PropTypes.object.isRequired,
        onCancelExecution: PropTypes.func.isRequired
    };

    _onDropdownChange(event, data) {
        this.setState({cancelClicked: true});
        this.props.onCancelExecution(this.props.item, data.value);
    }

    render () {
        let options = [
            {text: 'Cancel', value: "cancel"},
            {text: 'Force Cancel', value: "force-cancel"}
        ];

        return (
            <Label>
                <Icon name="spinner" loading />
                {this.props.item.status}
                <Dropdown disabled={this.state.cancelClicked} icon='delete' text=' ' pointing="bottom right"
                          selectOnBlur={false} openOnFocus={false}
                          options={options} onChange={this._onDropdownChange.bind(this)} />
            </Label>
        )
    }
}
