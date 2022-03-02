import { FunctionComponent, SyntheticEvent } from 'react';
import AddButton from './AddButton';
import DuplicationErrorPopup from './DuplicationErrorPopup';
import InvalidKeyErrorPopup from './InvalidKeyErrorPopup';
import LabelsList from './LabelsList';
import KeyDropdown from './KeyDropdown';
import ValueDropdown from './ValueDropdown';
import { Label } from './types';

const iconStyle = {
    position: 'absolute',
    top: '.7em',
    zIndex: 1
};
const internalKeyPrefix = 'csys-';

function useReservedKeys(toolbox: Stage.Types.Toolbox) {
    const { useState, useEffect } = React;
    const {
        Common: { DeploymentActions },
        Hooks: { useBoolean }
    } = Stage;

    const [reservedKeys, setReservedKeys] = useState<string[]>([]);
    const [fetchingReservedKeys, setFetchingReservedKeys, unsetFetchingReservedKeys] = useBoolean();

    useEffect(() => {
        const actions = new DeploymentActions(toolbox);
        setFetchingReservedKeys();
        actions
            .doGetReservedLabelKeys()
            .then(setReservedKeys)
            .catch(error => log.error('Cannot fetch reserved label keys', error))
            .finally(unsetFetchingReservedKeys);
    }, []);

    return { reservedKeys, fetchingReservedKeys };
}

export interface LabelsInputProps {
    hideInitialLabels?: boolean;
    initialLabels?: Label[];
    onChange: (labels: Label[]) => void;
    toolbox: Stage.Types.Toolbox;
}

const LabelsInput: FunctionComponent<LabelsInputProps> = ({
    hideInitialLabels = false,
    initialLabels = [],
    onChange,
    toolbox
}) => {
    const { useEffect, useRef } = React;
    const {
        Basic: { Divider, Form, Icon, Segment },
        Common: {
            DeploymentActions,
            // @ts-expect-error RevertToDefaultIcon is not converted to TS yet
            RevertToDefaultIcon
        },
        Hooks: { useBoolean, useOpenProp, useResettableState, useToggle },
        Utils: { combineClassNames }
    } = Stage;

    const [addingLabel, setAddingLabel, unsetAddingLabel] = useBoolean();
    const { reservedKeys, fetchingReservedKeys } = useReservedKeys(toolbox);
    const [labels, setLabels, resetLabels] = useResettableState(hideInitialLabels ? [] : initialLabels);
    const [open, toggleOpen] = useToggle();
    const [newLabelKey, setNewLabelKey, resetNewLabelKey] = useResettableState('');
    const [newLabelValue, setNewLabelValue, resetNewLabelValue] = useResettableState('');
    const keyDropdownRef = useRef<HTMLElement>(null);

    const newLabelIsProvided = !!newLabelKey && !!newLabelValue;
    const newLabelIsAlreadyPresent = (() => {
        const newLabel = { key: newLabelKey, value: newLabelValue };
        const allLabels = [...labels, ...(hideInitialLabels ? initialLabels : [])];
        return !!_.find(allLabels, newLabel);
    })();
    const newLabelKeyIsNotPermitted = newLabelKey.startsWith(internalKeyPrefix) && !reservedKeys.includes(newLabelKey);
    const addLabelNotAllowed =
        !newLabelIsProvided || newLabelIsAlreadyPresent || addingLabel || newLabelKeyIsNotPermitted;
    const duplicationErrorPopupOpen = newLabelIsProvided && newLabelIsAlreadyPresent;

    useEffect(() => {
        onChange(labels);
    }, [labels]);

    useOpenProp(open, () => {
        resetNewLabelKey();
        resetNewLabelValue();
    });

    useEffect(() => {
        if (!hideInitialLabels) setLabels(initialLabels);
    }, [initialLabels]);

    function onAddLabel() {
        function isLabelInSystem() {
            const actions = new DeploymentActions(toolbox);
            return actions
                .doGetLabel(newLabelKey, newLabelValue)
                .then(({ items }) => !_.isEmpty(items))
                .catch(error => {
                    log.error('Cannot check is label already present in the system', error);
                    return false;
                });
        }

        setAddingLabel();
        return isLabelInSystem().then(isInSystem => {
            const newLabels = [...labels, { key: newLabelKey, value: newLabelValue, isInSystem }];
            setLabels(newLabels);
            resetNewLabelKey();
            resetNewLabelValue();
            unsetAddingLabel();
        });
    }

    function onEnterPressOnAddButton() {
        onAddLabel().then(() => {
            keyDropdownRef.current?.click();
        });
    }

    return (
        <Segment
            className={combineClassNames([
                'dropdown',
                'selection',
                'fluid',
                fetchingReservedKeys && 'disabled',
                open && 'active'
            ])}
            // NOTE: z-index is overridden as for a div element with `active` and `dropdown` classes
            // it is by default set to 10, which makes LabelsInput to overlap opened dropdown,
            // it should be lesser than 10 not to overlap opened dropdowns (see style for: ".ui.dropdown .menu"),
            // it should be greater than 2 not to be hidden by checkbox fields (see style for: ".ui.checkbox input.hidden")
            style={{ padding: 0, margin: 0, zIndex: 3 }}
            tabIndex={0}
        >
            <div role="presentation" onClick={toggleOpen} style={{ cursor: 'pointer' }}>
                {!hideInitialLabels && (
                    <RevertToDefaultIcon
                        value={labels}
                        defaultValue={initialLabels}
                        onClick={(event: SyntheticEvent) => {
                            event.stopPropagation();
                            resetLabels();
                        }}
                        style={{ ...iconStyle, right: '2em' }}
                    />
                )}
                <Icon
                    data-testid="labels-input-switch"
                    name="dropdown"
                    link
                    onClick={toggleOpen}
                    style={{ ...iconStyle, right: '0.5em' }}
                />
                <LabelsList labels={labels} onChange={setLabels} />
            </div>
            {open && (
                <div style={{ padding: '0 0.5em' }}>
                    <Divider hidden={_.isEmpty(labels)} />
                    <Form.Group>
                        <Form.Field width={7}>
                            {newLabelKeyIsNotPermitted && (
                                <InvalidKeyErrorPopup keyPrefix={internalKeyPrefix} reservedKeys={reservedKeys} />
                            )}
                            <KeyDropdown
                                innerRef={keyDropdownRef}
                                onChange={setNewLabelKey}
                                toolbox={toolbox}
                                value={newLabelKey}
                            />
                        </Form.Field>
                        <Form.Field width={7}>
                            {duplicationErrorPopupOpen && <DuplicationErrorPopup />}
                            <ValueDropdown
                                labelKey={newLabelKey}
                                onChange={setNewLabelValue}
                                toolbox={toolbox}
                                value={newLabelValue}
                            />
                        </Form.Field>
                        <Form.Field width={2}>
                            <AddButton
                                onClick={onAddLabel}
                                onEnterPress={onEnterPressOnAddButton}
                                disabled={addLabelNotAllowed}
                            />
                        </Form.Field>
                    </Form.Group>
                </div>
            )}
        </Segment>
    );
};
export default LabelsInput;
