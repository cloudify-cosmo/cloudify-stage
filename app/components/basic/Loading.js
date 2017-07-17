/**
 * Created by kinneretzin on 01/01/2017.
 */

import React, { Component, PropTypes } from 'react';
import { Segment, Dimmer, Loader } from 'semantic-ui-react';

/**
 * Loading is a component which uses [Loader](https://react.semantic-ui.com/elements/loader) component from Semantic-UI-React
 * to display loader in center of parent component.
 *
 * ## Access
 * `Stage.Basic.Loading`
 *
 * ## Usage
 * ![Loading](manual/asset/Loading_0.png)
 * ```
 * <Loading />
 * ```
 *
 */
export default class Loading extends Component {

    /**
     * propTypes
     * @property {string} [message='Loading'] text message to display under loading icon
     */
    static propTypes = {
        message: PropTypes.string
    };

    static defaultProps = {
        message: 'Loading'
    };

    render() {
        return (
            <Segment basic style={{height:'100%'}}>
                <Dimmer active inverted>
                    <Loader>{this.props.message}</Loader>
                </Dimmer>
            </Segment>
        );
    }
}