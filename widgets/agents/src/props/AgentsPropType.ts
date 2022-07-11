export type Agents = {
    id: string;
    ip: string;
    deployment: string;
    node: string;
    system: string;
    version: string;
    // eslint-disable-next-line camelcase
    install_method: string;
};

export default PropTypes.arrayOf(
    PropTypes.shape({
        id: PropTypes.string,
        ip: PropTypes.string,
        deployment: PropTypes.string,
        node: PropTypes.string,
        system: PropTypes.string,
        version: PropTypes.string,
        install_method: PropTypes.string
    })
);
