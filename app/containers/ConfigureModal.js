import ConfigureModal from '../components/ConfigureModal';
import { connect } from 'react-redux';
import {saveClientConfig} from '../actions/clientConfig';

const mapStateToProps = (state, ownProps) => {
    return {
        config: state.config.clientConfig
    }
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        onSave: (config)=>{
            return dispatch(saveClientConfig(config));
        }
    }
};


export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ConfigureModal);