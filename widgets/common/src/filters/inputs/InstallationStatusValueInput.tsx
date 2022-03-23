import type { FunctionComponent } from 'react';
import type { DropdownProps } from 'semantic-ui-react';
import type { CommonAttributeValueInputProps } from './types';
import { getPlaceholderTranslation } from '../common';

const { Dropdown } = Stage.Basic;

const installationStatuses = ['active', 'inactive'] as const;
type InstallationStatus = typeof installationStatuses[number];
const options: DropdownProps['options'] = installationStatuses.map(status => ({ text: status, value: status }));

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
