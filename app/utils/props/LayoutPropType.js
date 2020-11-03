import PropTypes from 'prop-types';
import Consts from '../consts';

export default PropTypes.arrayOf(
    PropTypes.shape({
        type: PropTypes.oneOf(Consts.LAYOUT_TYPE.WIDGETS, Consts.LAYOUT_TYPE.TABS),
        content: PropTypes.arrayOf(PropTypes.shape({}))
    })
);
