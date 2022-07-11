export type Secret = {
    // eslint-disable-next-line camelcase
    created_at?: string;
    // eslint-disable-next-line camelcase
    created_by?: string;
    // eslint-disable-next-line camelcase
    is_hidden_value?: boolean;
    key?: string;
    // eslint-disable-next-line camelcase
    tenant_name?: string;
    // eslint-disable-next-line camelcase
    updated_at?: string;
    visibility?: string;
};

export default PropTypes.shape({
    created_at: PropTypes.string,
    created_by: PropTypes.string,
    is_hidden_value: PropTypes.bool,
    key: PropTypes.string,
    tenant_name: PropTypes.string,
    updated_at: PropTypes.string,
    visibility: PropTypes.string
});
