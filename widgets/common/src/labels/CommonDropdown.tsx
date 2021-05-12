import { ComponentProps, FunctionComponent, MutableRefObject } from 'react';
import { Dropdown } from 'semantic-ui-react';
import ValidationErrorPopup from './ValidationErrorPopup';

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
    value?: CommonDropdownValue;
}

const CommonDropdown: FunctionComponent<CommonDropdownProps> = ({
    allowAdditions = false,
    innerRef = null,
    onChange,
    value = null,
    ...rest
}) => {
    const { useEffect } = React;
    const {
        // @ts-expect-error DynamicDropdown is not converted to TS yet
        Common: { DynamicDropdown },
        Hooks: { useLabelInput }
    } = Stage;

    const {
        inputValue,
        invalidCharacterTyped,
        submitChange,
        resetInput,
        unsetInvalidCharacterTyped
    } = useLabelInput(onChange, { allowAnyValue: allowAdditions });

    useEffect(() => {
        if (_.isEmpty(value)) {
            resetInput();
        }
    }, [value]);

    return (
        <>
            {invalidCharacterTyped && <ValidationErrorPopup />}

            <DynamicDropdown
                allowAdditions={allowAdditions}
                innerRef={innerRef}
                clearable={false}
                itemsFormatter={(items: string[]) => _.map(items, item => ({ id: item }))}
                onBlur={unsetInvalidCharacterTyped}
                onChange={(newValue: CommonDropdownValue) => submitChange(null, { value: newValue })}
                onSearchChange={allowAdditions ? undefined : submitChange}
                searchQuery={allowAdditions ? undefined : inputValue}
                selectOnNavigation={allowAdditions}
                value={allowAdditions ? value : undefined}
                /* eslint-disable-next-line react/jsx-props-no-spreading */
                {...rest}
            />
        </>
    );
};
export default CommonDropdown;
