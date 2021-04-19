const LabelPropType = PropTypes.shape({ key: PropTypes.string, value: PropTypes.string, isInSystem: PropTypes.bool });
const LabelsPropType = PropTypes.arrayOf(LabelPropType);

declare global {
    namespace Stage {
        interface PropTypes {
            Label: typeof LabelPropType;
            Labels: typeof LabelsPropType;
        }
        namespace Common.Labels {
            export interface Label {
                key: string;
                value: string;
                isInSystem?: boolean;
            }
        }
    }
}
// NOTE: prevents leaking variables as global in TS
export {};

Stage.definePropType({
    name: 'Label',
    common: LabelPropType
});

Stage.definePropType({
    name: 'Labels',
    common: LabelsPropType
});
