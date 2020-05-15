/**
 * Created by kinneretzin on 18/10/2016.
 */

export default class extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            open: false
        };
    }

    createDeployment() {
        this.setState({ open: true });
    }

    hideModal() {
        this.setState({ open: false });
    }

    render() {
        const { loading, open } = this.state;
        const { Button } = Stage.Basic;
        const { DeployBlueprintModal } = Stage.Common;

        return (
            <div>
                <Button
                    color="green"
                    icon="rocket"
                    content="Create Deployment"
                    labelPosition="left"
                    className="widgetButton"
                    loading={loading}
                    onClick={this.createDeployment.bind(this)}
                />

                <DeployBlueprintModal open={open} onHide={this.hideModal.bind(this)} toolbox={this.props.toolbox} />
            </div>
        );
    }
}
