/**
 * Created by pawelposel on 03/11/2016.
 */

import { connect } from 'react-redux'
import ErrorPage from '../components/ErrorPage'

const mapStateToProps = (state, ownProps) => {
    return {
        error: state.app.error
    }
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ErrorPage);
