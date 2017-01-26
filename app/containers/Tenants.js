/**
 * Created by pawelposel on 03/11/2016.
 */

import { connect } from 'react-redux'
import Tenants from '../components/Tenants'
import {getTenants,selectTenant} from '../actions/tenants';
import {clearContext} from '../actions/context';
import {logout} from '../actions/managers';

const mapStateToProps = (state, ownProps) => {
    return {
        manager: ownProps.manager
    }
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        onLogout: () => {
            dispatch(logout());
        },

        onTenantChange: (newTenant) => {
            dispatch(clearContext());
            dispatch(selectTenant(newTenant));
        }
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Tenants);
