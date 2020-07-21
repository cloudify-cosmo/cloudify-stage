export default PropTypes.shape({
    isAuthenticated: PropTypes.bool,
    items: PropTypes.arrayOf(
        PropTypes.shape({
            created_at: PropTypes.string,
            description: PropTypes.string,
            html_url: PropTypes.string,
            id: PropTypes.string,
            image_url: PropTypes.string,
            isSelected: PropTypes.bool,
            main_blueprint: PropTypes.string,
            name: PropTypes.string,
            readme_url: PropTypes.string,
            updated_at: PropTypes.string,
            zip_url: PropTypes.string
        })
    ),
    source: PropTypes.string,
    total: PropTypes.number
});
