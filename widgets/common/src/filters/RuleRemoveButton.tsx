import type { ComponentProps, FunctionComponent } from 'react';
import { i18nPrefix } from './consts';

const {
    Basic: { Button },
    i18n
} = Stage;

interface RuleRemoveButtonProps {
    onClick: ComponentProps<typeof Button>['onClick'];
}

const removeButtonLabel = i18n.t(`${i18nPrefix}.buttons.removeRule`);
const RuleRemoveButton: FunctionComponent<RuleRemoveButtonProps> = ({ onClick }) => {
    return <Button aria-label={removeButtonLabel} title={removeButtonLabel} basic icon="trash" onClick={onClick} />;
};
export default RuleRemoveButton;
