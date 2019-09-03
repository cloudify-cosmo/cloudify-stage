/**
 * Created by jakubniezgoda on 24/05/2018.
 */

export default class extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            open: false
        };
    }

    _showModal() {
        this.setState({ open: true });
    }

    _hideModal() {
        this.setState({ open: false });
    }

    render() {
        const { MaintenanceModeActivationButton, MaintenanceModeModal } = Stage.Basic;

        return (
            <div>
                <MaintenanceModeActivationButton activate onClick={this._showModal.bind(this)} />
                <MaintenanceModeModal show={this.state.open} onHide={this._hideModal.bind(this)} />
            </div>
        );
    }
}
