/**
 * Created by jakub.niezgoda on 25/10/2018.
 */

import PropTypes from 'prop-types';
import React from 'react';

export default class RefreshIcon extends React.Component {

    constructor(props, context){
        super(props, context);
    }

    static propTypes = {
        manager: PropTypes.object.isRequired,
        toolbox: PropTypes.object.isRequired
    };

    handleClick(event) {
        event.stopPropagation();

        let actions = new Stage.Common.DeploymentActions(this.props.toolbox);
        actions.doExecute({id: this.props.manager.id}, {name: 'get_status'}, {})
            .then((response) => console.error(response));
    }

    render() {
        let {Icon, Popup} = Stage.Basic;

        return (
            <Popup trigger={<Icon name='refresh' link bordered onClick={this.handleClick.bind(this)} />}
                   content='Refresh Status' />
        );
    }
}

