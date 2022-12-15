import type { ComponentProps, FunctionComponent } from 'react';
import React from 'react';
import { getTranslation } from './common';
import { Button } from '../../../components/basic';

interface RuleRemoveButtonProps {
    onClick: ComponentProps<typeof Button>['onClick'];
}

const RuleRemoveButton: FunctionComponent<RuleRemoveButtonProps> = ({ onClick }) => {
    const removeButtonLabel = getTranslation('buttons.removeRule');
    return <Button aria-label={removeButtonLabel} title={removeButtonLabel} basic icon="trash" onClick={onClick} />;
};
export default RuleRemoveButton;
