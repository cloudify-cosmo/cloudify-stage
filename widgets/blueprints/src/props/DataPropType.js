export default PropTypes.shape({
    items: PropTypes.arrayOf(
        PropTypes.shape({
            created_at: PropTypes.string,
            created_by: PropTypes.string,
            depCount: PropTypes.number,
            description: PropTypes.string,
            id: PropTypes.string,
            isSelected: PropTypes.bool,
            main_file_name: PropTypes.string,
            updated_at: PropTypes.string,
            visibility: PropTypes.string
        })
    ),
    total: PropTypes.number
});
