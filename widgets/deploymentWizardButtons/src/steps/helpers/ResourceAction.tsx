// @ts-nocheck File not migrated fully to TS

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
