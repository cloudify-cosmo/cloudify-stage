/**
 * Created by kinneretzin on 13/12/2016.
 */

import React, { Component, PropTypes } from 'react';

export default class GridItem extends Component {
    static propTypes = {
        id: PropTypes.string.isRequired,
        x: PropTypes.number,
        y: PropTypes.number,
        width : PropTypes.number,
        height: PropTypes.number,
        zIndex: PropTypes.number,
        className: PropTypes.string,
        onItemAdded: PropTypes.func,
        onItemRemoved: PropTypes.func,
        maximized: PropTypes.bool
    };

    static defaultProps = {
        x: undefined,
        y: undefined,
        width: 1,
        height: 1,
        zIndex: undefined,
        className: '',
        maximized: false
    };

    componentDidMount() {
        if (this.props.onItemAdded) {
            this.props.onItemAdded(this.props.id);
        }
    }

    componentWillUnmount() {
        if (this.props.onItemRemoved) {
            this.props.onItemRemoved(this.props.id);
        }
    }
    componentDidUpdate() {
        if (this.props.zIndex) {
            $(this.refs.item).css('z-index',this.props.zIndex);
        }
    }

    render() {
        return (
            <div id={this.props.id} ref='item'
                 className={`grid-stack-item ${this.props.maximized?'maximize':''} ${this.props.className}`}
                 data-gs-auto-position={!(this.props.x !== undefined && this.props.y !== undefined)}
                 data-gs-x={this.props.x}
                 data-gs-y={this.props.y}
                 data-gs-width={this.props.width}
                 data-gs-height={this.props.height}
                 style={this.props.zIndex? {"zIndex":this.props.zIndex}:{}}>

                <div className='grid-stack-item-content'>
                    {this.props.children}
                </div>
            </div>
        );
    }
}

