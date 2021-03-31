import type { FunctionComponent } from 'react';
import { i18nPrefix } from './consts';

interface RuleRemoveButtonProps {
    onClick: () => void;
}

const RuleRemoveButton: FunctionComponent<RuleRemoveButtonProps> = ({ onClick }) => {
    const {
        Basic: { Button },
        i18n
    } = Stage;
    return <Button aria-label={i18n.t(`${i18nPrefix}.buttons.removeRule`)} basic icon="trash" onClick={onClick} />;
};
export default RuleRemoveButton;
