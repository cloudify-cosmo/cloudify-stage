/**
 * Created by pposel on 16/02/2017.
 */
import MaintenanceModePageMessage from '../../components/maintenance/MaintenanceModePageMessage';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

const mapStateToProps = (state, ownProps) => {
    return {
        manager: state.manager
    }
};
const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        navigateToHome: () => {
            return dispatch(push('/'));
        }
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(MaintenanceModePageMessage);