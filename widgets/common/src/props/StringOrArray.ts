const StringOrArrayPropType = PropTypes.oneOfType([PropTypes.string, PropTypes.array]);

declare global {
    namespace Stage {
        interface PropTypes {
            StringOrArray: typeof StringOrArrayPropType;
        }
    }
}

// NOTE: makes this file an ES module which prevent name collisions
export {};

Stage.definePropType({
    name: 'StringOrArray',
    common: StringOrArrayPropType
});
