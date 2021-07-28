import type { ComponentProps, FunctionComponent } from 'react';

// NOTE: technically, it should `Omit` `basic | color`, but then TS does not infer any props
// when using this component.
const DrilldownButton: FunctionComponent<ComponentProps<typeof Stage.Basic['Button']>> = props => (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <Stage.Basic.Button {...props} basic color="blue" />
);
export default DrilldownButton;
