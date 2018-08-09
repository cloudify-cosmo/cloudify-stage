/**
 * Created by jakub.niezgoda on 09/08/2018.
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import TaskStatus from './TaskStatus';

export default class TaskList extends Component {

    static propTypes = {
        header: PropTypes.string,
        list: PropTypes.arrayOf(PropTypes.shape(TaskStatus.propTypes)),
        withStatus: PropTypes.bool
    };

    static defaultProps = {
        header: 'Task list',
        withStatus: false
    };

    render() {
        const taskStatusList = this.props.list;
        let {List} = Stage.Basic;

        return (
            <React.Fragment>
                <Header as='h4'>{this.props.header}</Header>
                <List ordered relaxed>
                    {
                        _.map(taskStatusList, (taskStatus) =>
                            <List.Item key={taskStatus.name}>
                                {
                                    this.props.withStatus
                                    ? <TaskStatus {...taskStatus} />
                                    : taskStatus.name
                                }
                            </List.Item>)
                    }
                </List>
            </React.Fragment>
        );
    }
}
