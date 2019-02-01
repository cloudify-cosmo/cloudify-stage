/**
 * Created by jakub.niezgoda on 09/08/2018.
 */

import TaskStatus from './TaskStatus';

export default class TaskList extends React.Component {

    static propTypes = {
        header: PropTypes.string,
        tasks: PropTypes.arrayOf(PropTypes.shape(TaskStatus.propTypes)),
        withStatus: PropTypes.bool
    };

    static defaultProps = {
        header: 'Task list',
        withStatus: false
    };

    render() {
        const tasks = this.props.tasks;
        let {Header, List} = Stage.Basic;

        return (
            <React.Fragment>
                <Header as='h4'>{this.props.header}</Header>
                <List ordered relaxed>
                    {
                        _.map(tasks, (task) =>
                            <List.Item key={task.name}>
                                {
                                    this.props.withStatus
                                    ? <TaskStatus {...task} />
                                    : task.name
                                }
                            </List.Item>)
                    }
                </List>
            </React.Fragment>
        );
    }
}
