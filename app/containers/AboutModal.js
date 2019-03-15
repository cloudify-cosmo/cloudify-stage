/**
 * Created by jakubniezgoda on 15/03/2019.
 */

import { connect } from 'react-redux'

import { push } from 'connected-react-router';
import Consts from '../utils/consts';

import AboutModal from '../components/AboutModal'

const mapStateToProps = (state, ownProps) => {
    return {
        version: _.get(state, 'manager.version', {}),
        license: _.get(state, 'manager.license.data', {})
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        onLicenseManagment: () => dispatch(push(Consts.LICENSE_PAGE_PATH))
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AboutModal);
