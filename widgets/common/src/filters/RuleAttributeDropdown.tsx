import type { FunctionComponent } from 'react';
import type { DropdownItemProps } from 'semantic-ui-react/dist/commonjs/modules/Dropdown/DropdownItem';

const attributes = ['Label', 'Blueprint', 'Site name', 'Creator'];

const RuleAttributeDropdown: FunctionComponent = () => {
    const { Dropdown } = Stage.Basic;
    const attributeOptions = attributes.map((attribute): DropdownItemProps => ({ text: attribute, value: attribute }));

    return <Dropdown search selection name="ruleAttribute" options={attributeOptions} />;
};
export default RuleAttributeDropdown;
