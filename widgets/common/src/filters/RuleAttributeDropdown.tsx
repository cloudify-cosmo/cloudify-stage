import type { FunctionComponent } from 'react';

const attributes = ['Label', 'Blueprint', 'Site name', 'Creator'];

const RuleAttributeDropdown: FunctionComponent = () => {
    const { Dropdown } = Stage.Basic;
    const attributeOptions = _.map(attributes, attribute => ({ text: attribute, value: attribute }));

    return <Dropdown search selection name="ruleAttribute" options={attributeOptions} />;
};
export default RuleAttributeDropdown;
