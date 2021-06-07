/**
 * Created by pawelposel on 03/11/2016.
 */

import { connect } from 'react-redux';
import ErrorPage from '../components/ErrorPage';

const mapStateToProps = state => {
    return {
        error: state.app.error
    };
};

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(ErrorPage);
