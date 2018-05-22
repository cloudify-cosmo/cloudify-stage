/**
 * Created by jakubniezgoda on 21/05/2018.
 */

export default class extends React.Component {

    constructor(props,context) {
        super(props,context);

        this.state = {
            open: false,
            error: null
        }
    }

    _showModal(){
        this.setState({open: true});
    }

    _hideModal () {
        this.setState({open: false});
    }

    render() {
        let {ErrorMessage} = Stage.Basic;
        let {UploadPluginModal} = Stage.Common;

        return (
            <div>
                <ErrorMessage error={this.state.error} onDismiss={() => this.setState({error: null})} autoHide={true}/>

                <button className={`ui yellow labeled icon button fluid ${this.state.loading?'loading':''}`} onClick={this._showModal.bind(this)}>
                    <i className="upload icon" />Upload Plugin
                </button>

                <UploadPluginModal open={this.state.open} onHide={this._hideModal.bind(this)} toolbox={this.props.toolbox}/>
            </div>
        );
    }
}