import { capitalize, startCase, words } from 'lodash';
import type { ExtendedBlueprint } from './types';

interface BlueprintStateProps {
    blueprint: ExtendedBlueprint;
}

export default function BlueprintState({ blueprint }: BlueprintStateProps) {
    const { Icon, Popup } = Stage.Basic;
    const normalizedBlueprintState = startCase(blueprint.state);
    return (
        <>
            {words(normalizedBlueprintState)[0]}{' '}
            {blueprint.error && (
                <Popup
                    offset={[-11, 0]}
                    trigger={<Icon link name="warning circle" color="red" />}
                    content={blueprint.error}
                    header={capitalize(normalizedBlueprintState)}
                />
            )}
        </>
    );
}
