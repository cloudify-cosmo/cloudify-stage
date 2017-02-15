/**
 * Created by pawelposel on 03/11/2016.
 */

import { connect } from 'react-redux'
import Manager from '../components/Manager'

const mapStateToProps = (state, ownProps) => {
    return {
        manager: ownProps.manager
    }
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Manager);
