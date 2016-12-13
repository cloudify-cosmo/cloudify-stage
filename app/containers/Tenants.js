/**
 * Created by pawelposel on 03/11/2016.
 */

import { connect } from 'react-redux'
import { push } from 'react-router-redux';
import Tenants from '../components/Tenants'
import {getTenants,selectTenant} from '../actions/tenants';

const mapStateToProps = (state, ownProps) => {
    return {
        manager: ownProps.manager
    }
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        onLogout: () => {
            dispatch(push('/login'));
        },

        onTenantChange: (newTenant) => {
            dispatch(selectTenant(newTenant));
        },

        fetchTenants: (manager)=>{
            dispatch(getTenants(manager));
        }
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Tenants);
