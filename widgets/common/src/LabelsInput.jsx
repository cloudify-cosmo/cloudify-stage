import React, { useRef } from 'react';
import { Ref } from 'semantic-ui-react';
import styled from 'styled-components';

const {
    i18n,
    Hooks: { useBoolean, useResettableState }
} = Stage;

const LabelPropType = PropTypes.shape({ key: PropTypes.string, value: PropTypes.string });
const LabelsPropType = PropTypes.arrayOf(LabelPropType);
const RefPropType = PropTypes.oneOfType([PropTypes.func, PropTypes.shape({ current: PropTypes.instanceOf(Element) })]);

function onSearchChange(setSearchQuery, setShowError, unsetShowError) {
    const allowedCharacters = /^[a-z0-9_-]*$/i;
    return (event, { searchQuery: newSearchQuery }) => {
        if (allowedCharacters.test(newSearchQuery)) {
            setSearchQuery(_.toLower(newSearchQuery));
            unsetShowError();
        } else {
            setShowError();
        }
    };
}

function onValueChange(onChange, unsetShowError, resetSearchQuery) {
    return (event, data) => {
        onChange(event, data);
        unsetShowError();
        resetSearchQuery();
    };
}

function ValidationErrorPopup({ open }) {
    const { Popup } = Stage.Basic;

    return (
        <Popup
            open={open}
            trigger={<div />}
            content={i18n.t('widgets.common.labels.validationError')}
            position="top left"
            pinned
            wide
        />
    );
}

ValidationErrorPopup.propTypes = {
    open: PropTypes.bool
};

ValidationErrorPopup.defaultProps = {
    open: false
};

function LabelKeyDropdown({ value, onChange, toolbox, innerRef }) {
    const [searchQuery, setSearchQuery, resetSearchQuery] = useResettableState('');
    const [showError, setShowError, unsetShowError] = useBoolean();

    const { DynamicDropdown } = Stage.Common;

    return (
        <>
            <ValidationErrorPopup open={showError} />

            <Ref innerRef={innerRef}>
                <DynamicDropdown
                    additionLabel={i18n.t('widgets.common.labels.newKey')}
                    allowAdditions
                    clearable={false}
                    fetchAll
                    fetchUrl="/labels/deployments"
                    name="labelKey"
                    onChange={onValueChange(onChange, unsetShowError, resetSearchQuery)}
                    onSearchChange={onSearchChange(setSearchQuery, setShowError, unsetShowError)}
                    placeholder={i18n.t('widgets.common.labels.keyPlaceholder')}
                    searchQuery={searchQuery}
                    selectOnNavigation={false}
                    toolbox={toolbox}
                    value={value}
                    valueProp=""
                    tabIndex={0}
                />
            </Ref>
        </>
    );
}

LabelKeyDropdown.propTypes = {
    innerRef: RefPropType,
    onChange: PropTypes.func,
    toolbox: Stage.PropTypes.Toolbox.isRequired,
    value: PropTypes.string
};

LabelKeyDropdown.defaultProps = {
    innerRef: null,
    onChange: _.noop,
    value: null
};

function LabelValueDropdown({ innerRef, labelKey, onChange, toolbox, value }) {
    const [searchQuery, setSearchQuery, resetSearchQuery] = useResettableState('');
    const [showError, setShowError, unsetShowError] = useBoolean();
    const { DynamicDropdown } = Stage.Common;

    return (
        <>
            <ValidationErrorPopup open={showError} />

            <Ref innerRef={innerRef}>
                <DynamicDropdown
                    additionLabel={i18n.t('widgets.common.labels.newValue')}
                    allowAdditions
                    clearable={false}
                    disabled={!labelKey}
                    fetchAll
                    fetchUrl={`/labels/deployments/${labelKey}`}
                    name="labelValue"
                    onChange={onValueChange(onChange, unsetShowError, resetSearchQuery)}
                    onSearchChange={onSearchChange(setSearchQuery, setShowError, unsetShowError)}
                    placeholder={i18n.t('widgets.common.labels.valuePlaceholder')}
                    searchQuery={searchQuery}
                    selectOnNavigation={false}
                    toolbox={toolbox}
                    value={value}
                    valueProp=""
                    tabIndex={labelKey ? 0 : -1}
                />
            </Ref>
        </>
    );
}

LabelValueDropdown.propTypes = {
    innerRef: RefPropType,
    labelKey: PropTypes.string,
    onChange: PropTypes.func,
    toolbox: Stage.PropTypes.Toolbox.isRequired,
    value: PropTypes.string
};

LabelValueDropdown.defaultProps = {
    innerRef: null,
    labelKey: '',
    onChange: _.noop,
    value: null
};

function LabelAddButton({ disabled, innerRef, onClick }) {
    const { Button } = Stage.Basic;

    return (
        <Ref innerRef={innerRef}>
            <Button icon="add" onClick={onClick} disabled={disabled} fluid />
        </Ref>
    );
}

LabelAddButton.propTypes = {
    disabled: PropTypes.bool,
    innerRef: RefPropType,
    onClick: PropTypes.func
};

LabelAddButton.defaultProps = {
    disabled: false,
    innerRef: null,
    onClick: _.noop
};

const StyledSegment = styled(Stage.Basic.Segment)`
    padding: 0 !important;
    border-color: ${props => (props.open ? '#96c8da !important' : 'inherit')};
    box-shadow: none !important;
    -webkit-box-shadow: none !important;
`;

function LabelsList({ labels, onChangeLabels }) {
    const { Label, Icon, Popup } = Stage.Basic;
    const maxLength = 20;

    return (
        <div className="ui multiple dropdown" style={{ paddingRight: '4.1em', minHeight: '2em' }}>
            {_.map(labels, ({ key, value }) => {
                const truncatedKey = _.truncate(key, { length: maxLength });
                const truncatedValue = _.truncate(value, { length: maxLength });

                return (
                    <Popup open={truncatedKey === key && truncatedValue === value ? false : undefined} wide>
                        <Popup.Trigger>
                            <Label as="a">
                                {truncatedKey} <span style={{ fontWeight: 'lighter' }}>{truncatedValue}</span>
                                <Icon
                                    name="delete"
                                    onClick={() =>
                                        onChangeLabels(
                                            _.differenceBy(
                                                labels,
                                                [{ key, value }],
                                                label => label.key === key && label.value === value
                                            )
                                        )
                                    }
                                />
                            </Label>
                        </Popup.Trigger>
                        <strong>{key}</strong> {value}
                    </Popup>
                );
            })}
        </div>
    );
}

LabelsList.propTypes = {
    labels: LabelsPropType,
    onChangeLabels: PropTypes.func
};

LabelsList.defaultProps = {
    labels: [],
    onChangeLabels: _.noop
};

export default function LabelsInput({ initialValue, toolbox }) {
    const [newLabelKey, setNewLabelKey, resetNewLabelKey] = useResettableState('');
    const [newLabelValue, setNewLabelValue, resetNewLabelValue] = useResettableState('');
    const [labels, setLabels, resetLabels] = useResettableState(initialValue);
    const [open, setOpen, unsetOpen] = useBoolean();

    const { Divider, Form, Icon } = Stage.Basic;
    const { RevertToDefaultIcon } = Stage.Common;

    const keyDropdownRef = useRef();
    const valueDropdownRef = useRef();
    const addButtonRef = useRef();

    const focusDelay = 200;

    function focusOnInput(dropdownRef) {
        const inputNode = _.get(dropdownRef, 'current.childNodes[0]');
        if (inputNode && _.isFunction(inputNode.focus)) {
            setTimeout(() => inputNode.focus(), focusDelay);
        }
    }

    function focusOnButton(buttonRef) {
        const buttonNode = _.get(buttonRef, 'current');
        if (buttonNode && _.isFunction(buttonNode.focus)) {
            setTimeout(() => buttonNode.focus(), focusDelay);
        }
    }

    function isNewLabelPresent() {
        return _.findIndex(labels, { key: newLabelKey, value: newLabelValue }) >= 0;
    }

    function areNewKeyAndValueEmpty() {
        return !newLabelKey || !newLabelValue;
    }

    async function onAddLabel() {
        if (!areNewKeyAndValueEmpty() && !isNewLabelPresent()) {
            const newLabels = [...labels, { key: newLabelKey, value: newLabelValue }];
            setLabels(newLabels);
            resetNewLabelKey();
            resetNewLabelValue();
            focusOnInput(keyDropdownRef);
        }
    }

    function onChangeLabelValue(labelValue) {
        setNewLabelValue(labelValue);
        focusOnButton(addButtonRef);
    }

    function onChangeLabelKey(labelKey) {
        setNewLabelKey(labelKey);
        focusOnInput(valueDropdownRef);
    }

    return (
        <StyledSegment open={open}>
            <RevertToDefaultIcon
                value={labels}
                defaultValue={initialValue}
                onClick={resetLabels}
                style={{
                    position: 'absolute',
                    top: '.7em',
                    right: '2em'
                }}
            />
            <Icon
                name="dropdown"
                link
                onClick={open ? unsetOpen : setOpen}
                style={{
                    position: 'absolute',
                    top: '.7em',
                    right: '0.5em'
                }}
            />
            <LabelsList labels={labels} onChangeLabels={setLabels} />
            {open && (
                <div style={{ padding: '0 0.5em' }}>
                    <Divider hidden={_.isEmpty(labels)} />
                    <Form.Group>
                        <Form.Field width={7}>
                            <LabelKeyDropdown
                                innerRef={keyDropdownRef}
                                onChange={onChangeLabelKey}
                                toolbox={toolbox}
                                value={newLabelKey}
                            />
                        </Form.Field>
                        <Form.Field width={7}>
                            <LabelValueDropdown
                                innerRef={valueDropdownRef}
                                labelKey={newLabelKey}
                                onChange={onChangeLabelValue}
                                toolbox={toolbox}
                                value={newLabelValue}
                            />
                        </Form.Field>
                        <Form.Field width={2}>
                            <LabelAddButton
                                onClick={onAddLabel}
                                disabled={areNewKeyAndValueEmpty() || isNewLabelPresent()}
                                innerRef={addButtonRef}
                            />
                        </Form.Field>
                    </Form.Group>
                </div>
            )}
        </StyledSegment>
    );
}

LabelsInput.propTypes = {
    toolbox: Stage.PropTypes.Toolbox.isRequired,
    initialValue: PropTypes.arrayOf(PropTypes.string)
};

LabelsInput.defaultProps = {
    initialValue: []
};

Stage.defineCommon({
    name: 'LabelsInput',
    common: LabelsInput
});
