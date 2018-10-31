/**
 * Created by jakub.niezgoda on 30/10/2018.
 */

import PropTypes from 'prop-types';
import React from 'react';

export default class ExecuteWorkflowIcon extends React.Component {

    constructor(props, context){
        super(props, context);
    }

    static propTypes = {
        show: PropTypes.bool,
        onClick: PropTypes.func,
        workflows: PropTypes.array
    };

    static defaultProps = {
        show: false,
        onClick: _.noop,
        workflows: []
    };

    handleClick(event, workflow) {
        this.props.onClick(workflow);
    }

    render () {
        var {Menu, PopupMenu} = Stage.Basic;

        return (
            <PopupMenu icon='cogs' help='Execute Workflow' bordered>
                <Menu vertical>
                    {
                        _.map(this.props.workflows, (workflow) =>
                            <Menu.Item name={workflow.name} onClick={(event) => this.handleClick(event, workflow)}
                                       key={workflow.name}>
                                {_.capitalize(_.lowerCase(workflow.name))}
                            </Menu.Item>
                        )
                    }
                </Menu>
            </PopupMenu>
        );
    }
}

