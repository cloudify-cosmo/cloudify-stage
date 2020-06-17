/**
 * Created by jakub.niezgoda on 11/07/18.
 */

import PropTypes from 'prop-types';
import React from 'react';
import { Grid, Segment } from 'semantic-ui-react';

import SplashLoadingScreen from '../../utils/SplashLoadingScreen';

/**
 * MessageContainer is a component which uses [Grid](https://react.semantic-ui.com/collections/grid) and
 * [Segment](https://react.semantic-ui.com/elements/segment) components from Semantic-UI-React to display message box.
 * Can be displayed in full screen or inside another container.
 *
 * ## Usage
 * ### Full screen message - eg. Error Page
 * ```
 * <MessageContainer/>
 * ```
 *
 * ### In widget message - eg. Sites Map notification
 * ```
 * <MessageContainer wide={true} margin='30px auto'/>
 * ```
 *
 */
export default function MessageContainer({ children, loading, margin, size, textAlign, wide }) {
    SplashLoadingScreen.turnOff();

    const style = { margin, textAlign };
    const widths = wide ? { mobile: 14, tablet: 14, computer: 12 } : { mobile: 12, tablet: 8, computer: 6 };

    return (
        <Grid centered container columns={1}>
            <Grid.Column {...widths}>
                <Segment size={size} padded raised style={style} loading={loading}>
                    {children}
                </Segment>
            </Grid.Column>
        </Grid>
    );
}

MessageContainer.propTypes = {
    /**
     * primary content
     */
    children: PropTypes.node.isRequired,

    /**
     * if set to true show its content is being loaded
     */
    loading: PropTypes.bool,

    /**
     * sets the Segment's margin
     */
    margin: PropTypes.string,

    /**
     * sets the Segment's size
     */
    size: PropTypes.string,

    /**
     * sets the horizontal alignment of the text
     */
    textAlign: PropTypes.string,

    /**
     * if set to true the container will be wider
     */
    wide: PropTypes.bool
};

MessageContainer.defaultProps = {
    loading: false,
    margin: '80px auto',
    size: 'big',
    textAlign: 'center',
    wide: false
};
