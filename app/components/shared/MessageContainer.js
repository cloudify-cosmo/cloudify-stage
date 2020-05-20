/**
 * Created by jakub.niezgoda on 11/07/18.
 */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
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
export default class MessageContainer extends Component {
    /**
     * propTypes
     *
     * @property {object[]} children - primary content
     * @property {string} [textAlign='center'] - sets the horizontal alignment of the text
     * @property {boolean} [loading=false] - if set to true show its content is being loaded
     * @property {string} [size='big'] - sets the Segment's size
     * @property {boolean} [wide=false] - if set to true the container will be wider
     * @property {string} [margin='80px auto'] - sets the Segment's margin
     */
    static propTypes = {
        children: PropTypes.any.isRequired,
        textAlign: PropTypes.string,
        loading: PropTypes.bool,
        size: PropTypes.string,
        wide: PropTypes.bool,
        margin: PropTypes.string
    };

    static defaultProps = {
        textAlign: 'center',
        loading: false,
        size: 'big',
        wide: false,
        margin: '80px auto'
    };

    render() {
        const { children, loading, margin, size, textAlign, wide } = this.props;
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
}
