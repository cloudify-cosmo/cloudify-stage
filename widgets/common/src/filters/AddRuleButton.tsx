import type { ComponentProps, FunctionComponent } from 'react';
import { getTranslation } from './common';

interface AddRuleButtonProps {
    onClick: ComponentProps<typeof Stage.Basic.Button>['onClick'];
}

const AddRuleButton: FunctionComponent<AddRuleButtonProps> = ({ onClick }) => {
    const { Button } = Stage.Basic;
    return <Button icon="add" content={getTranslation('buttons.addRule')} onClick={onClick} />;
};
export default AddRuleButton;
