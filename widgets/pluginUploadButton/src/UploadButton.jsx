/**
 * Created by jakubniezgoda on 21/05/2018.
 */

export default class UploadButton extends React.Component {
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
        const { toolbox } = this.props;
        const { loading, open } = this.state;
        const { Button } = Stage.Basic;
        const { UploadPluginModal } = Stage.Common;

        return (
            <div>
                <Button
                    color="yellow"
                    icon="upload"
                    content="Upload Plugin"
                    labelPosition="left"
                    className="widgetButton"
                    loading={loading}
                    onClick={this.showModal}
                />

                <UploadPluginModal open={open} onHide={this.hideModal} toolbox={toolbox} />
            </div>
        );
    }
}

UploadButton.propTypes = { toolbox: Stage.PropTypes.Toolbox.isRequired };
