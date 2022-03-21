import type { FunctionComponent } from 'react';
import { DropdownProps } from 'semantic-ui-react';
import type { CommonAttributeValueInputProps } from './types';
import { getPlaceholderTranslation } from '../common';

const { Dropdown } = Stage.Basic;

type InstallationStatus = 'active' | 'inactive';
const options: DropdownProps['options'] = [
    {
        text: 'active',
        value: 'active'
    },
    {
        text: 'inactive',
        value: 'inactive'
    }
];

type InstallationStatusValueInputProps = Pick<CommonAttributeValueInputProps, 'value' | 'onChange'>;

const InstallationStatusValueInput: FunctionComponent<InstallationStatusValueInputProps> = ({ onChange, value }) => {
    return (
        <Dropdown
            name="installationStatus"
            value={value[0]}
            options={options}
            selection
            selectOnNavigation
            onChange={(_event, data) => onChange([data.value as InstallationStatus])}
            placeholder={getPlaceholderTranslation('installationStatus')}
        />
    );
};

export default InstallationStatusValueInput;
