/**
 * Created by jakub.niezgoda on 21/09/2018.
 */

import PropTypes from 'prop-types';
import { Component } from 'react';
import { withRouter } from 'react-router-dom';

// Ref.: https://reacttraining.com/react-router/web/guides/scroll-restoration

class ScrollToTop extends Component {
    componentDidUpdate(prevProps) {
        const { location } = this.props;
        if (location !== prevProps.location) {
            $('div.main').scrollTop(0);
        }
    }

    render() {
        const { children } = this.props;
        return children;
    }
}

ScrollToTop.propTypes = {
    location: PropTypes.shape({}).isRequired,
    children: PropTypes.node.isRequired
};

export default withRouter(ScrollToTop);
