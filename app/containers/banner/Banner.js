/**
 * Created by jakub.niezgoda on 15/03/2019.
 */

import { connect } from 'react-redux';

import Consts from '../../utils/consts';
import Banner from '../../components/banner/Banner';

const mapStateToProps = state => {
    return {
        isCommunity: _.get(state, 'manager.version.edition', Consts.EDITION.PREMIUM) === Consts.EDITION.COMMUNITY,
        isExpired: _.get(state, 'manager.license.status', Consts.LICENSE.EMPTY) === Consts.LICENSE.EXPIRED,
        isTrial: _.get(state, 'manager.license.data.trial', false),
        licenseEdition: _.get(state, 'manager.license.data.license_edition', ''),
        productName: _.get(state, 'config.app.whiteLabel.productName', 'Cloudify'),
        productVersion: _.get(state, 'manager.version.version', ''),
        showVersionDetails: _.get(state, 'config.app.whiteLabel.showVersionDetails', true)
    };
};

const mapDispatchToProps = () => {};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Banner);
