/**
 * Created by jakub.niezgoda on 09/08/2018.
 */

export default class ResourceAction extends React.Component {

    static propTypes = {
        children: PropTypes.any
    };

    render() {
        let action = this.props.children;

        return (
            <div>
                {action}
            </div>
        );
    }
}