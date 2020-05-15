/**
 * Created by jakubniezgoda on 22/05/2018.
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
        const { Button } = Stage.Basic;
        const { UploadBlueprintModal } = Stage.Common;

        return (
            <div>
                <Button
                    color="blue"
                    icon="upload"
                    content="Upload Blueprint"
                    labelPosition="left"
                    className="widgetButton"
                    loading={this.state.loading}
                    onClick={this.showModal.bind(this)}
                />

                <UploadBlueprintModal
                    open={this.state.open}
                    onHide={this.hideModal.bind(this)}
                    toolbox={this.props.toolbox}
                />
            </div>
        );
    }
}
