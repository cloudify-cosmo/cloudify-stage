/**
 * Created by jakubniezgoda on 26/02/2018.
 */

import { connect } from 'react-redux';
import Help from '../components/Help';

const mapStateToProps = state => {
    const currentVersion = _.get(state, 'manager.version.version');
    const isDevelopment = version => _.includes(version, 'dev');

    return {
        version: isDevelopment(currentVersion) ? 'latest' : currentVersion
    };
};

const mapDispatchToProps = () => {
    return {};
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Help);
