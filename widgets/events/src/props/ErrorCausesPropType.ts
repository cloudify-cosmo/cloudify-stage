export default PropTypes.arrayOf(
    PropTypes.shape({ message: PropTypes.string, traceback: PropTypes.string, type: PropTypes.string })
);
