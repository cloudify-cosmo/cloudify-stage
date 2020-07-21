/**
 * Created by jakub.niezgoda on 09/08/2018.
 */

import TaskStatus from './TaskStatus';

export default class TaskList extends React.Component {
    static propTypes = {
        header: PropTypes.string,
        tasks: PropTypes.arrayOf(PropTypes.shape(TaskStatus.propTypes)).isRequired,
        withStatus: PropTypes.bool
    };

    static defaultProps = {
        header: 'Task list',
        withStatus: false
    };

    render() {
        const { tasks, header, withStatus } = this.props;
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
}
