import type { ComponentProps, FunctionComponent } from 'react';
import { getTranslation } from './common';

const { Button } = Stage.Basic;

interface AddRuleButtonProps {
    onClick: ComponentProps<typeof Stage.Basic.Button>['onClick'];
}

const AddRuleButton: FunctionComponent<AddRuleButtonProps> = ({ onClick }) => {
    return <Button icon="add" content={getTranslation('buttons.addRule')} onClick={onClick} />;
};
export default AddRuleButton;
