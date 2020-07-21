Stage.definePropType({
    name: 'StringOrArray',
    common: PropTypes.oneOfType([PropTypes.string, PropTypes.array])
});
