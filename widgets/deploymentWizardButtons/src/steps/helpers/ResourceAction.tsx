/**
 * Created by jakub.niezgoda on 09/08/2018.
 */

export default function ResourceAction({ children }) {
    const action = children;

    return <div>{action}</div>;
}
ResourceAction.propTypes = {
    children: PropTypes.oneOfType([PropTypes.string, PropTypes.element])
};

ResourceAction.defaultProps = {
    children: ''
};
