import type { ComponentProps, FunctionComponent, RefObject } from 'react';
import { Dropdown } from 'semantic-ui-react';
import ValidationErrorPopup from './ValidationErrorPopup';
import type { LabelInputType } from './types';

type CommonDropdownValue = string | string[];
type CommonDropdownOnChange = ((value: string) => void) | ((value: string[]) => void);

export interface KeyAndValueDropdownProps {
    allowAdditions?: ComponentProps<typeof Dropdown>['allowAdditions'];
    innerRef?: RefObject<HTMLElement>;
    onChange: CommonDropdownOnChange;
    toolbox: Stage.Types.WidgetlessToolbox;
}

interface CommonDropdownProps
    extends KeyAndValueDropdownProps,
        Pick<
            ComponentProps<typeof Dropdown>,
            'additionLabel' | 'disabled' | 'multiple' | 'name' | 'noResultsMessage' | 'placeholder' | 'tabIndex'
        > {
    fetchUrl: string;
    type: LabelInputType;
    value?: CommonDropdownValue;
}

const CommonDropdown: FunctionComponent<CommonDropdownProps> = ({ allowAdditions = false, ...rest }) =>
    allowAdditions ? <CommonDropdownWithAdditions {...rest} /> : <CommonDropdownWithoutAdditions {...rest} />;
export default CommonDropdown;

const CommonDropdownWithAdditions: FunctionComponent<CommonDropdownProps> = ({
    innerRef,
    onChange,
    value = null,
    type,
    ...rest
}) => {
    const { DynamicDropdown } = Stage.Common;

    return (
        <DynamicDropdown
            allowAdditions
            clearable
            innerRef={innerRef}
            itemsFormatter={(items: string[]) => _.map(items, item => ({ id: item }))}
            // NOTE: no knowledge whether this handles multiple elements or not, so need to assert `as any`
            onChange={v => onChange(v as any)}
            selectOnNavigation
            value={value}
            {...rest}
        />
    );
};

const CommonDropdownWithoutAdditions: FunctionComponent<CommonDropdownProps> = ({
    innerRef,
    onChange,
    type,
    value = null,
    ...rest
}) => {
    const { useEffect } = React;
    const {
        Common: { DynamicDropdown },
        Hooks: { useLabelInput }
    } = Stage;

    const { inputValue, invalidCharacterTyped, submitChange, resetInput, unsetInvalidCharacterTyped } = useLabelInput(
        onChange as (value: string) => void,
        type
    );

    useEffect(() => {
        if (_.isEmpty(value)) {
            resetInput();
        }
    }, [value]);

    return (
        <>
            {invalidCharacterTyped && <ValidationErrorPopup type={type} />}

            <DynamicDropdown
                clearable={false}
                innerRef={innerRef}
                itemsFormatter={(items: string[]) => _.map(items, item => ({ id: item }))}
                onBlur={unsetInvalidCharacterTyped}
                onChange={(newValue: any) => submitChange(null, { value: newValue })}
                onSearchChange={(event, data) =>
                    // NOTE: assumes the items are only strings
                    submitChange(event, { value: data.value as string, searchQuery: data.searchQuery })
                }
                searchQuery={inputValue}
                value={value}
                {...rest}
            />
        </>
    );
};
