/**
 * Created by jakubniezgoda on 22/05/2018.
 */

export default class UploadButton extends React.Component {
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
        const { toolbox } = this.props;
        const { loading, open } = this.state;
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
                    loading={loading}
                    onClick={this.showModal.bind(this)}
                />

                <UploadBlueprintModal open={open} onHide={this.hideModal.bind(this)} toolbox={toolbox} />
            </div>
        );
    }
}

UploadButton.propTypes = {
    toolbox: Stage.Common.PropTypes.Toolbox.isRequired
};
