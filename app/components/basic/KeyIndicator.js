/**
 * Created by pawelposel on 03/11/2016.
 */

import React, { Component, PropTypes } from 'react';
import { Icon, Statistic } from 'semantic-ui-react'

/**
 * KeyIndicator - a simple component showing a counter along with an icon
 *
 * List of available icons can be found [here](https://react.semantic-ui.com/elements/icon)
 *
 * ## Usage
 *
 * ### KeyIndicator (User Stars)
 *
 * ![KeyIndicator](manual/asset/keyIndicator/KeyIndicator_0.png)
 * ```
 * <KeyIndicator title="User Stars" icon="star" number={data.stars}/>
 *```
 */
export default class KeyIndicator extends Component {

    /**
     * @property {string} title='Not defined' Label appearing at the bottom of the component
     * @property {string} icon='warning circle' Name of the [icon](https://react.semantic-ui.com/elements/icon) to be displayed
     * @property {number} number=0 Numerical value to be displayed
     */
    static propTypes = {
        title: PropTypes.string.isRequired,
        icon: PropTypes.string.isRequired,
        number: PropTypes.number.isRequired
    };

    static defaultProps = {
        title: 'Not defined',
        icon: 'warning circle',
        number: 0
    };

    render() {
        return (
            <div className="keyIndicator">
                <Statistic>
                    <Statistic.Value>
                        <Icon name={this.props.icon} />
                        {this.props.number}
                    </Statistic.Value>
                    <Statistic.Label>{this.props.title}</Statistic.Label>
                </Statistic>
            </div>
        );
    }
}
 