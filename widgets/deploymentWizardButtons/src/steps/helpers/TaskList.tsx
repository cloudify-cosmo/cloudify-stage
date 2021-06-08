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
                {_.map(tasks, ({ name, status, error }) => (
                    <List.Item key={name}>
                        {withStatus ? <TaskStatus name={name} status={status} error={error} /> : name}
                    </List.Item>
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
