/**
 * Created by addihorowitz on 19/09/2016.
 */

import _ from 'lodash';
import { connect } from 'react-redux';
import Header from '../../components/layout/Header';
import { resetPagesForTenant } from '../../actions/userApp';
import { toogleSidebar } from '../../actions/app';

const mapStateToProps = state => {
    return {
        manager: state.manager || {},
        mode: state.config.mode,
        pageTitle: _.get(state, 'config.app.whiteLabel.pageTitle')
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onResetPages: tenantList => {
            _.forEach(tenantList, tenant => {
                dispatch(resetPagesForTenant(tenant));
            });
        },
        onSidebarOpen() {
            dispatch(toogleSidebar());
        }
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Header);
