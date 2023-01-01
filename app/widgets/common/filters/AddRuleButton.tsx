import type { ComponentProps, FunctionComponent } from 'react';
import React from 'react';
import { getTranslation } from './common';
import { Button } from '../../../components/basic';

interface AddRuleButtonProps {
    onClick: ComponentProps<typeof Button>['onClick'];
}

const AddRuleButton: FunctionComponent<AddRuleButtonProps> = ({ onClick }) => {
    return <Button icon="add" content={getTranslation('buttons.addRule')} onClick={onClick} />;
};
export default AddRuleButton;
