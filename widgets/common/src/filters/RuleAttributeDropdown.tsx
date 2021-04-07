import { camelCase } from 'lodash';
import type { FunctionComponent } from 'react';
import type { DropdownItemProps } from 'semantic-ui-react/dist/commonjs/modules/Dropdown/DropdownItem';
import { i18nPrefix } from './consts';

const { i18n } = Stage;
const attributeOptions = ['label', 'blueprint_id', 'site_name', 'created_by'].map(
    (attribute): DropdownItemProps => ({
        text: i18n.t(`${i18nPrefix}.attributesLabels.${camelCase(attribute)}`),
        value: attribute
    })
);

const RuleAttributeDropdown: FunctionComponent = () => {
    const { Dropdown } = Stage.Basic;

    return <Dropdown search selection name="ruleAttribute" options={attributeOptions} />;
};
export default RuleAttributeDropdown;
