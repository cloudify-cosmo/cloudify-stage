/**
 * Created by jakub.niezgoda on 20/06/2018.
 */
import { connect } from 'react-redux';
import Logo from '../components/Logo';

const mapStateToProps = (state, ownProps) => {
    return {
        pageTitle: (state.config.app && state.config.app.whiteLabel.enabled) ? state.config.app.whiteLabel.pageTitle : 'Cloudify Console'
    }
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {};
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Logo);

