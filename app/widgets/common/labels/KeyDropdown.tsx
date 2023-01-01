import type { FunctionComponent } from 'react';
import React, { useContext } from 'react';
import type { KeyAndValueDropdownProps } from './CommonDropdown';
import CommonDropdown from './CommonDropdown';
import ResourceTypeContext from '../filters/resourceTypeContext';

interface KeyDropdownProps extends KeyAndValueDropdownProps {
    value: string | string[];
    multiple?: boolean;
}

const KeyDropdown: FunctionComponent<KeyDropdownProps> = ({
    allowAdditions = false,
    innerRef,
    onChange,
    toolbox,
    value,
    multiple
}) => {
    const { i18n } = Stage;
    const resourceType = useContext(ResourceTypeContext);

    return (
        <CommonDropdown
            type="key"
            innerRef={innerRef}
            fetchUrl={`/labels/${resourceType}`}
            noResultsMessage={value && !allowAdditions ? i18n.t('widgets.common.labels.newKey') : undefined}
            placeholder={i18n.t('widgets.common.labels.keyPlaceholder')}
            name="labelKey"
            tabIndex={0}
            onChange={onChange}
            toolbox={toolbox}
            additionLabel={`${i18n.t('widgets.common.labels.newKey')} `}
            allowAdditions={allowAdditions}
            value={value}
            multiple={multiple}
        />
    );
};
export default KeyDropdown;
