/**
 * Created by jakub.niezgoda on 09/08/2018.
 */

export default class ResourceAction extends React.Component {
    static propTypes = {
        children: PropTypes.any
    };

    render() {
        const { children } = this.props;
        const action = children;

        return <div>{action}</div>;
    }
}
