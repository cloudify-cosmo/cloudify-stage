/**
 * Created by kinneretzin on 18/10/2016.
 */

import DeployModal from './DeployModal';

export default class extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            open: false
        };
    }

    _createDeployment() {
        this.setState({ open: true });
    }

    _hideModal() {
        this.setState({ open: false });
    }

    render() {
        const { Button } = Stage.Basic;

        return (
            <div>
                <Button
                    color="green"
                    icon="rocket"
                    content="Create Deployment"
                    labelPosition="left"
                    className="widgetButton"
                    loading={this.state.loading}
                    onClick={this._createDeployment.bind(this)}
                />

                <DeployModal open={this.state.open} onHide={this._hideModal.bind(this)} toolbox={this.props.toolbox} />
            </div>
        );
    }
}
