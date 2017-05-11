/**
 * Created by pawelposel on 03/11/2016.
 */

import { connect } from 'react-redux'
import Tenants from '../components/Tenants'
import {selectTenant, getTenants} from '../actions/tenants';
import {clearContext} from '../actions/context';

const mapStateToProps = (state, ownProps) => {
    return {
        manager: ownProps.manager
    }
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        onTenantChange: (newTenant) => {
            dispatch(clearContext());
            dispatch(selectTenant(newTenant));
        },

        onTenantsRefresh: () => {
            dispatch(getTenants(ownProps.manager));
        }
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Tenants);
