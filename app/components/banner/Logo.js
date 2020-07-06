import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { Logo as CommonLogo } from 'cloudify-ui-components';

function Logo({ style, url }) {
    return <CommonLogo style={style} url={url} />;
}

Logo.propTypes = {
    style: PropTypes.shape({}),
    url: PropTypes.string
};
Logo.defaultProps = {
    style: {},
    url: ''
};

const mapStateToProps = state => ({
    url: _.get(state, 'config.app.whiteLabel.logoUrl', '')
});

const mapDispatchToProps = () => ({});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Logo);
