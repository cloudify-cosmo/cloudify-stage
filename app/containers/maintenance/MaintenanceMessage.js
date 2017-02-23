/**
 * Created by pposel on 16/02/2017.
 */

import MaintenanceMessage from '../../components/maintenance/MaintenanceMessage';
import { connect } from 'react-redux';

const mapStateToProps = (state, ownProps) => {
    return {
        manager: ownProps.manager
    }
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(MaintenanceMessage);
