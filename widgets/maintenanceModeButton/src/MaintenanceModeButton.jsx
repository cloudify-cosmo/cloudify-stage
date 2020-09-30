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

    showModal = () => {
        this.setState({ open: true });
    };

    hideModal = () => {
        this.setState({ open: false });
    };

    render() {
        const { MaintenanceModeActivationButton, MaintenanceModeModal } = Stage.Shared;
        const { open } = this.state;

        return (
            <div>
                <MaintenanceModeActivationButton activate onClick={this.showModal} />
                <MaintenanceModeModal show={open} onHide={this.hideModal} />
            </div>
        );
    }
}
