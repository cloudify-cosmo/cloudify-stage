/**
 * Created by kinneretzin on 18/10/2016.
 */


import DeployModal from './DeployModal';
import Actions from './actions';

export default class extends React.Component {

    constructor(props,context) {
        super(props,context);

        this.state = {
            open: false,
            loading: false,
            error: null,
            blueprints: {items:[]}
        }
    }

    _createDeployment(){
        this.setState({loading: true});

        var actions = new Actions(this.props.toolbox);
        actions.doGetBlueprints().then((blueprints)=>{
            this.setState({loading: false, error: null, blueprints, open: true});
        }).catch((err)=> {
            this.setState({loading: false, error: err.message});
        });
    }

    _hideModal () {
        this.setState({open: false});
    }

    render() {
        var ErrorMessage = Stage.Basic.ErrorMessage;

        return (
            <div>
                <ErrorMessage error={this.state.error}/>

                <button className={`ui blue labeled icon button fluid ${this.state.loading?'loading':''}`} onClick={this._createDeployment.bind(this)}>
                    <i className="rocket icon"></i>Create new deployment
                </button>

                <DeployModal open={this.state.open} blueprints={this.state.blueprints} onHide={this._hideModal.bind(this)} toolbox={this.props.toolbox}/>
            </div>
        );
    }
}