// @ts-nocheck File not migrated fully to TS

import { connect } from 'react-redux';

import { VisibilityField } from '../components/basic';
import stageUtils from '../utils/stageUtils';
import consts from '../utils/consts';

const mapStateToProps = (state, ownProps) => {
    return {
        disallowGlobal:
            ownProps.disallowGlobal ||
            !stageUtils.isUserAuthorized(consts.permissions.CREATE_GLOBAL_RESOURCE, state.manager)
    };
};

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(VisibilityField);
