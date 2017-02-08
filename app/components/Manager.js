/**
 * Created by kinneretzin on 26/09/2016.
 */

import React, { Component, PropTypes } from 'react';

export default class Manager extends Component {
    static propTypes = {
        manager: PropTypes.object.isRequired
    };

    componentWillMount() {
        if (_.get(this.props.manager,'tenants.selected')) {
            this.props.fetchManagerStatus(this.props.manager);
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (_.get(prevProps.manager,'tenants.selected') !== _.get(this.props.manager,'tenants.selected')) {
            this.props.fetchManagerStatus(this.props.manager);
        }
    }

    renderStatusIcon(status) {
        let {Icon} = Stage.Basic;
        return !status
            ? <Icon name='circle' className='statusIcon' />
            : <Icon name='circle' color={(status === 'running') ? 'green' : 'red'} className='statusIcon'/>;
    }

    render() {
        return (
            <div className='manager'>
                {this.props.manager.ip}
                {this.renderStatusIcon(this.props.manager.status)}
            </div>
        );
    }
}

