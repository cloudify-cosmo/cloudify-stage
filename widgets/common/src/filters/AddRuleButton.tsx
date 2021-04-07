import type { ComponentProps, FunctionComponent } from 'react';
import { i18nPrefix } from './consts';

const {
    Basic: { Button },
    i18n
} = Stage;

interface AddRuleButtonProps {
    onClick: ComponentProps<typeof Button>['onClick'];
}

const AddRuleButton: FunctionComponent<AddRuleButtonProps> = ({ onClick }) => {
    return <Button icon="add" content={i18n.t(`${i18nPrefix}.buttons.addRule`)} onClick={onClick} />;
};
export default AddRuleButton;
