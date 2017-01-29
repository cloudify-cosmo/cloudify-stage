/**
 * Created by jakubniezgoda on 11/01/2017.
 */
  
import React, { Component, PropTypes } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

export default class GridDataExpandable extends Component {

    static propTypes = {
        children: PropTypes.any.isRequired,
        className: PropTypes.string,
        numberOfColumns: PropTypes.number
    };

    static defaultProps = {
        numberOfColumns: 0
    };

    render() {
        return (
            <tr className="active">
                <td className={this.props.className} colSpan={this.props.numberOfColumns}>
                    <ReactCSSTransitionGroup
                        transitionName="dataExpandable"
                        transitionAppear={true}
                        transitionAppearTimeout={500}
                        transitionEnter={true}
                        transitionEnterTimeout={500}
                        transitionLeave={false}>
                        {this.props.children}
                    </ReactCSSTransitionGroup>
                </td>
            </tr>
        );
    }
}
 