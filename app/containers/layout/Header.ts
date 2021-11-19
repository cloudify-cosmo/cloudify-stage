// @ts-nocheck File not migrated fully to TS
/**
 * Created by addihorowitz on 19/09/2016.
 */

import _ from 'lodash';
import { connect } from 'react-redux';
import Header from '../../components/layout/Header';
import { resetPagesForTenant } from '../../actions/userApp';

const mapStateToProps = state => {
    return {
        manager: state.manager || {},
        mode: state.config.mode
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onResetPages: tenantList => {
            _.forEach(tenantList, tenant => {
                dispatch(resetPagesForTenant(tenant));
            });
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);
