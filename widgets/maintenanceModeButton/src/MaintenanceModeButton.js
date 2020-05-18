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

    showModal() {
        this.setState({ open: true });
    }

    hideModal() {
        this.setState({ open: false });
    }

    render() {
        const { MaintenanceModeActivationButton, MaintenanceModeModal } = Stage.Shared;

        return (
            <div>
                <MaintenanceModeActivationButton activate onClick={this.showModal.bind(this)} />
                <MaintenanceModeModal show={this.state.open} onHide={this.hideModal.bind(this)} />
            </div>
        );
    }
}
