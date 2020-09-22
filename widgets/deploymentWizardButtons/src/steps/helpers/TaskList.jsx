/**
 * Created by jakub.niezgoda on 09/08/2018.
 */

import TaskStatus from './TaskStatus';

export default function TaskList({ tasks, header, withStatus }) {
    const { Header, List } = Stage.Basic;

    return (
        <>
            <Header as="h4">{header}</Header>
            <List ordered relaxed>
                {_.map(tasks, task => (
                    <List.Item key={task.name}>{withStatus ? <TaskStatus {...task} /> : task.name}</List.Item>
                ))}
            </List>
        </>
    );
}

TaskList.propTypes = {
    header: PropTypes.string,
    tasks: PropTypes.arrayOf(PropTypes.shape(TaskStatus.propTypes)).isRequired,
    withStatus: PropTypes.bool
};

TaskList.defaultProps = {
    header: 'Task list',
    withStatus: false
};
