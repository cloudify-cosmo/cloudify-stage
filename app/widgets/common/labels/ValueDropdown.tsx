import type { ComponentProps, FunctionComponent } from 'react';
import React from 'react';
import type { KeyAndValueDropdownProps } from './CommonDropdown';
import CommonDropdown from './CommonDropdown';

interface ValueDropdownProps extends KeyAndValueDropdownProps {
    labelKey: string;
    multiple?: boolean;
    value: ComponentProps<typeof CommonDropdown>['value'];
}

const ValueDropdown: FunctionComponent<ValueDropdownProps> = ({
    allowAdditions = false,
    labelKey = '',
    multiple = false,
    onChange,
    toolbox,
    value
}) => {
    const { i18n } = Stage;

    return (
        <CommonDropdown
            type="value"
            disabled={!labelKey}
            fetchUrl={labelKey ? `/labels/deployments/${labelKey}` : ''}
            noResultsMessage={value && !allowAdditions ? i18n.t('widgets.common.labels.newValue') : undefined}
            placeholder={i18n.t('widgets.common.labels.valuePlaceholder')}
            name="labelValue"
            tabIndex={labelKey ? 0 : -1}
            onChange={onChange}
            toolbox={toolbox}
            multiple={multiple}
            additionLabel={`${i18n.t('widgets.common.labels.newValue')} `}
            allowAdditions={allowAdditions}
            value={value}
        />
    );
};
export default ValueDropdown;
