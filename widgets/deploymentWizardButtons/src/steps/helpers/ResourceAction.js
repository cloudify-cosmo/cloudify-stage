/**
 * Created by jakub.niezgoda on 09/08/2018.
 */

export default class ResourceAction extends React.Component {
    static propTypes = {
        children: PropTypes.oneOfType([PropTypes.string, PropTypes.element])
    };

    render() {
        const { children } = this.props;
        const action = children;

        return <div>{action}</div>;
    }
}

ResourceAction.defaultProps = {
    children: ''
};
