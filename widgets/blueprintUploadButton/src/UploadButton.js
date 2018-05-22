/**
 * Created by jakubniezgoda on 22/05/2018.
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
        let {UploadBlueprintModal} = Stage.Common;

        return (
            <div>
                <Button color='blue' icon='upload' content='Upload Blueprint' labelPosition='left' fluid
                        loading={this.state.loading} onClick={this._showModal.bind(this)} />

                <UploadBlueprintModal open={this.state.open} onHide={this._hideModal.bind(this)} toolbox={this.props.toolbox}/>
            </div>
        );
    }
}