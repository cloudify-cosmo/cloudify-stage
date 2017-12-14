import React, { Component, PropTypes } from 'react';
import {Popup,  Button, Header} from 'semantic-ui-react'

export default class PopupConfirm extends Component {

    constructor(props, context) {
        super(props, context);

        this.state = {
            showPopup: false,
            canConfirm: ''
        };
    }

    static propTypes = {
        trigger: PropTypes.any,
        content: PropTypes.string,
        onCancel: PropTypes.func,
        onConfirm: PropTypes.func,
        onCanConfirm: PropTypes.func
    };

    static defaultProps = {
        onCancel: () => {},
        onConfirm: () => {},
        onCanConfirm: () => {}
    };

    openPopup() {
        this.setState({canConfirm: this.props.onCanConfirm(), showPopup: true});
    }

    closePopup() {
        this.setState({showPopup: false})
    }

    handleCancel() {
        this.closePopup();
        this.props.onCancel();
    }

    handleConfirm() {
        this.closePopup();
        this.props.onConfirm();
    }

    render() {
        return (
            <Popup trigger={this.props.trigger} on="click" wide="very" hideOnScroll open={this.state.showPopup}
                   onOpen={this.openPopup.bind(this)} onClose={this.closePopup.bind(this)}>
                <Header>{this.state.canConfirm ? this.state.canConfirm : this.props.content}</Header>

                {this.state.canConfirm ?
                    <div className="rightFloated">
                        <Button icon="checkmark" content="Ok" color="green" onClick={this.handleCancel.bind(this)}/>
                    </div>
                    :
                    <div className="rightFloated">
                        <Button icon="remove" content="Cancel" basic onClick={this.handleCancel.bind(this)}/>
                        <Button icon="checkmark" content="Ok" color="green" onClick={this.handleConfirm.bind(this)}/>
                    </div>
                }
            </Popup>
        );
    }
}
