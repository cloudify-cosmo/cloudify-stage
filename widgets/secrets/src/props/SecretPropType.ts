export type Secret = {
    created_at?: string;
    created_by?: string;
    is_hidden_value?: boolean;
    key?: string;
    tenant_name?: string;
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
