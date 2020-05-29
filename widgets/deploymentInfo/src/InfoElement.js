export default function InfoElement({ name, style, value }) {
    const { Header } = Stage.Basic;

    return (
        <Header as="h3" style={style}>
            {name}
            <Header.Subheader>{value}</Header.Subheader>
        </Header>
    );
}
InfoElement.propTypes = {
    name: PropTypes.node.isRequired,
    value: PropTypes.node.isRequired,
    // eslint-disable-next-line react/forbid-prop-types
    style: PropTypes.object
};
InfoElement.defaultProps = {
    style: {}
};
