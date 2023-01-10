import PropTypes from 'prop-types';

const StringOrArrayPropType = PropTypes.oneOfType([PropTypes.string, PropTypes.array]);
export default StringOrArrayPropType;
