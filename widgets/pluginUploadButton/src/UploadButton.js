/**
 * Created by jakubniezgoda on 21/05/2018.
 */

export default class extends React.Component {

    constructor(props,context) {
        super(props,context);

        this.state = {
            open: false
        }
    }

    _showModal() {
        this.setState({open: true});
    }

    _hideModal() {
        this.setState({open: false});
    }

    render() {
        let {Button} = Stage.Basic;
        let {UploadPluginModal} = Stage.Common;

        return (
            <div>
                <Button color='yellow' icon='upload' content='Upload Plugin' labelPosition='left' fluid
                        loading={this.state.loading} onClick={this._showModal.bind(this)} />

                <UploadPluginModal open={this.state.open} onHide={this._hideModal.bind(this)} toolbox={this.props.toolbox}/>
            </div>
        );
    }
}