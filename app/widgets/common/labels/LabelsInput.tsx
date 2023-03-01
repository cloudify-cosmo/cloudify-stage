import type { CSSProperties, SyntheticEvent } from 'react';
import React from 'react';
import { pick, toNumber } from 'lodash';
import type { LabelsListProps } from 'cloudify-ui-components';
import LabelErrorPopup from './LabelErrorPopup';
import RevertToDefaultIcon from '../components/RevertToDefaultIcon';
import DeploymentActions from '../deployments/DeploymentActions';
import AddButton from './AddButton';
import DuplicationErrorPopup from './DuplicationErrorPopup';
import InvalidKeyErrorPopup from './InvalidKeyErrorPopup';
import KeyDropdown from './KeyDropdown';
import type { Label as BasicLabel } from './types';
import ValueDropdown from './ValueDropdown';
import { isLabelModifiable } from './common';

const iconStyle = {
    position: 'absolute',
    top: '.7em',
    zIndex: 1
} as CSSProperties;
const internalKeyPrefix = 'csys-';

function useReservedKeys(toolbox: Stage.Types.Toolbox) {
    const { useState, useEffect } = React;
    const {
        Hooks: { useBoolean }
    } = Stage;

    const [reservedKeys, setReservedKeys] = useState<string[]>([]);
    const [fetchingReservedKeys, setFetchingReservedKeys, unsetFetchingReservedKeys] = useBoolean();

    useEffect(() => {
        const actions = new DeploymentActions(toolbox.getManager());
        setFetchingReservedKeys();
        actions
            .doGetReservedLabelKeys()
            .then(labelKeys => {
                setReservedKeys(labelKeys.filter(isLabelModifiable));
            })
            .catch(error => log.error('Cannot fetch reserved label keys', error))
            .finally(unsetFetchingReservedKeys);
    }, []);

    return { reservedKeys, fetchingReservedKeys };
}

const coordinateLabelKeys = {
    latitude: 'csys-location-lat',
    longitude: 'csys-location-long'
};

function validateCoordinateLabels(newValue: string, newLabelKey: string, existingLabelKeys: string[]) {
    if (!Object.values(coordinateLabelKeys).find(key => key === newLabelKey)) {
        return undefined;
    }
    const boundary = newLabelKey === coordinateLabelKeys.latitude ? 90 : 180;

    const number = toNumber(newValue);

    if (Number.isNaN(number) || number > boundary || number < -boundary) {
        return Stage.i18n.t('widgets.common.labels.labelNumberValidationError', { to: boundary, from: -boundary });
    }

    if (existingLabelKeys.find(label => label === newLabelKey)) {
        return Stage.i18n.t('widgets.common.labels.labelDuplicatedKeyError');
    }

    return undefined;
}

export interface ExtraFormFieldProps<Label extends BasicLabel> {
    label: Label;
    onChange: (label: Label) => void;
}

export interface LabelsInputProps<Label extends BasicLabel> {
    hideInitialLabels?: boolean;
    initialLabels?: Label[];
    onChange: (labels: Label[]) => void;
    toolbox: Stage.Types.Toolbox;
    extraFormField?: React.FunctionComponent<ExtraFormFieldProps<Label>>;
    coloringStrategy?: LabelsListProps<Label>['coloringStrategy'];
}

const defaultInitialLabels: any[] = [];

function LabelsInput<Label extends BasicLabel = BasicLabel>({
    hideInitialLabels = false,
    initialLabels = defaultInitialLabels,
    onChange,
    toolbox,
    extraFormField,
    coloringStrategy
}: LabelsInputProps<Label>) {
    type LabelWithSystemData = Label & {
        isInSystem?: boolean;
    };

    const { useEffect, useRef, useState } = React;
    const {
        Basic: { Divider, Form, Icon, LabelsList, Segment },
        Hooks: { useBoolean, useOpenProp, useResettableState, useToggle },
        Utils: { combineClassNames }
    } = Stage;

    const [addingLabel, setAddingLabel, unsetAddingLabel] = useBoolean();
    const { reservedKeys, fetchingReservedKeys } = useReservedKeys(toolbox);
    const [labels, setLabels, resetLabels] = useResettableState<LabelWithSystemData[]>(
        hideInitialLabels ? [] : initialLabels
    );
    const [open, toggleOpen] = useToggle();
    const [newLabel, setNewLabel] = useState<Label>({ key: '', value: '' } as Label);
    const keyDropdownRef = useRef<HTMLElement>(null);

    const newLabelKey = newLabel.key;
    const newLabelValue = newLabel.value;

    function resetNewLabel() {
        setNewLabel({ ...newLabel, key: '', value: '' });
    }

    const newLabelIsProvided = !!newLabelKey && !!newLabelValue;
    const newLabelIsAlreadyPresent = (() => {
        const allLabels = [...labels, ...(hideInitialLabels ? initialLabels : [])];
        return !!_.find(allLabels, pick(newLabel, 'key', 'value'));
    })();
    const keyValidationError = validateCoordinateLabels(
        newLabelValue,
        newLabelKey,
        labels.map(({ key }) => key)
    );
    const newLabelKeyIsNotPermitted = newLabelKey.startsWith(internalKeyPrefix) && !reservedKeys.includes(newLabelKey);
    const addLabelNotAllowed =
        !newLabelIsProvided ||
        newLabelIsAlreadyPresent ||
        addingLabel ||
        newLabelKeyIsNotPermitted ||
        !!keyValidationError;
    const duplicationErrorPopupOpen = newLabelIsProvided && newLabelIsAlreadyPresent;

    useEffect(() => {
        onChange(labels);
    }, [labels]);

    useOpenProp(open, () => {
        resetNewLabel();
    });

    useEffect(() => {
        if (!hideInitialLabels) setLabels(initialLabels);
    }, [initialLabels]);

    function onAddLabel() {
        function isLabelInSystem() {
            const actions = new DeploymentActions(toolbox.getManager());
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
            const newLabels = [...labels, { ...newLabel, isInSystem }];
            setLabels(newLabels);
            resetNewLabel();
            unsetAddingLabel();
        });
    }

    function onEnterPressOnAddButton() {
        onAddLabel().then(() => {
            keyDropdownRef.current?.click();
        });
    }

    const ExtraFormField = extraFormField;

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
                <LabelsList labels={labels} onChange={setLabels} coloringStrategy={coloringStrategy} />
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
                                onChange={(key: string) => setNewLabel({ ...newLabel, key })}
                                toolbox={toolbox}
                                value={newLabelKey}
                            />
                        </Form.Field>
                        <Form.Field width={7}>
                            {duplicationErrorPopupOpen && <DuplicationErrorPopup />}
                            {keyValidationError && <LabelErrorPopup content={keyValidationError} />}
                            <ValueDropdown
                                labelKey={newLabelKey}
                                onChange={(value: string) => setNewLabel({ ...newLabel, value })}
                                toolbox={toolbox}
                                value={newLabelValue}
                            />
                        </Form.Field>
                        {ExtraFormField && <ExtraFormField label={newLabel} onChange={setNewLabel} />}
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
}
export default LabelsInput;
