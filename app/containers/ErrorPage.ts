// @ts-nocheck File not migrated fully to TS

import { connect } from 'react-redux';
import ErrorPage from '../components/ErrorPage';

const mapStateToProps = state => {
    return {
        error: state.app.error
    };
};

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(ErrorPage);
