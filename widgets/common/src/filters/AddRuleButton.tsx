import type { FunctionComponent } from 'react';
import { i18nPrefix } from './consts';

interface AddRuleButtonProps {
    onClick: () => void;
}

const AddRuleButton: FunctionComponent<AddRuleButtonProps> = ({ onClick }) => {
    const {
        Basic: { Button },
        i18n
    } = Stage;
    return <Button icon="add" content={i18n.t(`${i18nPrefix}.buttons.addRule`)} onClick={onClick} />;
};
export default AddRuleButton;
