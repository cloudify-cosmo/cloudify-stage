/**
 * Created by jakub.niezgoda on 20/06/2018.
 */
import { connect } from 'react-redux';
import Logo from '../components/Logo';

const mapStateToProps = (state, ownProps) => {
    const defaultPageTitle = 'Cloudify Console';

    return {
        pageTitle: _.get(state, 'config.app.whiteLabel.enabled', false)
            ? _.get(state, 'config.app.whiteLabel.pageTitle', defaultPageTitle)
            : defaultPageTitle
    }
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {};
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Logo);

