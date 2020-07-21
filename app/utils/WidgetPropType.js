import PropTypes from 'prop-types';

export default PropTypes.shape({
    configuration: PropTypes.shape({
        pollingTime: PropTypes.number,
        pageSize: PropTypes.number
    }),
    id: PropTypes.string,
    name: PropTypes.string,
    definition: PropTypes.shape({
        events: PropTypes.arrayOf(
            PropTypes.shape({
                selector: PropTypes.string,
                event: PropTypes.string,
                fn: PropTypes.func
            })
        ),
        fetchUrl: PropTypes.oneOfType([PropTypes.string, PropTypes.objectOf(PropTypes.string)]),
        fetchData: PropTypes.func,
        isReact: PropTypes.bool,
        postRender: PropTypes.func,
        render: PropTypes.func,
        showHeader: PropTypes.bool,
        showBorder: PropTypes.bool
    })
});
