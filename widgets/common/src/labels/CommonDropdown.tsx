import type { ComponentProps, FunctionComponent, MutableRefObject } from 'react';
import { Dropdown } from 'semantic-ui-react';
import ValidationErrorPopup from './ValidationErrorPopup';
import type { LabelInputType } from './types';

type CommonDropdownValue = string | string[];
type CommonDropdownOnChange = ((value: string) => void) | ((value: string[]) => void);

export interface KeyAndValueDropdownProps {
    allowAdditions?: ComponentProps<typeof Dropdown>['allowAdditions'];
    innerRef?: MutableRefObject<HTMLElement | undefined>;
    onChange: CommonDropdownOnChange;
    toolbox: Stage.Types.Toolbox;
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
    // eslint-disable-next-line react/jsx-props-no-spreading
    allowAdditions ? <MultipleValuesDynamicDropdown {...rest} /> : <SingleValueDynamicDropdown {...rest} />;
export default CommonDropdown;

const MultipleValuesDynamicDropdown: FunctionComponent<CommonDropdownProps> = ({
    innerRef = null,
    onChange,
    value = null,
    type,
    ...rest
}) => {
    const {
        // @ts-ignore Property 'DynamicDropdown' does not exist on type 'typeof Common'
        Common: { DynamicDropdown }
    } = Stage;

    return (
        <DynamicDropdown
            allowAdditions
            clearable
            innerRef={innerRef}
            itemsFormatter={(items: string[]) => _.map(items, item => ({ id: item }))}
            onChange={onChange}
            selectOnNavigation
            value={value}
            /* eslint-disable-next-line react/jsx-props-no-spreading */
            {...rest}
        />
    );
};

const SingleValueDynamicDropdown: FunctionComponent<CommonDropdownProps> = ({
    innerRef = null,
    onChange,
    type,
    value = null,
    ...rest
}) => {
    const { useEffect } = React;
    const {
        // @ts-expect-error DynamicDropdown is not converted to TS yet
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
                onSearchChange={submitChange}
                searchQuery={inputValue}
                /* eslint-disable-next-line react/jsx-props-no-spreading */
                {...rest}
            />
        </>
    );
};
