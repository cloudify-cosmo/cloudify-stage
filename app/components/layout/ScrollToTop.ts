import PropTypes from 'prop-types';
import { Component } from 'react';
import { withRouter } from 'react-router-dom';

import type { RouteComponentProps } from 'react-router';

class ScrollToTop extends Component<RouteComponentProps> {
    componentDidUpdate(prevProps: RouteComponentProps) {
        const { location } = this.props;

        if (location !== prevProps.location) {
            const mainContainer = document.querySelector<HTMLElement>('div.main');

            if (mainContainer) {
                mainContainer.scrollTo(0, 0);
            }
        }
    }

    render() {
        const { children } = this.props;
        return children;
    }
}

(ScrollToTop as any).propTypes = {
    location: PropTypes.shape({}).isRequired,
    children: PropTypes.node.isRequired
};

export default withRouter<any, typeof ScrollToTop>(ScrollToTop);
