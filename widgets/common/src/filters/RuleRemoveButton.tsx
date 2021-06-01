import type { ComponentProps, FunctionComponent } from 'react';
import { getTranslation } from './common';

interface RuleRemoveButtonProps {
    onClick: ComponentProps<typeof Stage.Basic.Button>['onClick'];
}

const removeButtonLabel = getTranslation('buttons.removeRule');
const RuleRemoveButton: FunctionComponent<RuleRemoveButtonProps> = ({ onClick }) => {
    const { Button } = Stage.Basic;
    return <Button aria-label={removeButtonLabel} title={removeButtonLabel} basic icon="trash" onClick={onClick} />;
};
export default RuleRemoveButton;
