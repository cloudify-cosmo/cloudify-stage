import AddButton from './AddButton';
import DuplicationErrorPopup from './DuplicationErrorPopup';
import InvalidKeyErrorPopup from './InvalidKeyErrorPopup';
import LabelsList from './LabelsList';
import KeyDropdown from './KeyDropdown';
import ValueDropdown from './ValueDropdown';

const iconStyle = {
    position: 'absolute',
    top: '.7em',
    zIndex: 1
};

export default function LabelsInput({ hideInitialLabels, initialLabels, onChange, toolbox }) {
    const { useEffect, useRef, useState } = React;
    const {
        Basic: { Divider, Form, Icon, Segment },
        Common: { DeploymentActions, RevertToDefaultIcon },
        Hooks: { useBoolean, useResettableState, useToggle },
        Utils: { combineClassNames },
        i18n
    } = Stage;

    const [addingLabel, setAddingLabel, unsetAddingLabel] = useBoolean();
    const [reservedKeys, setReservedKeys] = useState([]);
    const [fetchingReservedKeys, setFetchingReservedKeys, unsetFetchingReservedKeys] = useBoolean();
    const [labels, setLabels, resetLabels] = useResettableState(hideInitialLabels ? [] : initialLabels);
    const [open, toggleOpen] = useToggle();
    const [newLabelKey, setNewLabelKey, resetNewLabelKey] = useResettableState('');
    const [newLabelValue, setNewLabelValue, resetNewLabelValue] = useResettableState('');
    const keyDropdownRef = useRef();

    const newLabelIsProvided = !!newLabelKey && !!newLabelValue;
    const newLabelIsAlreadyPresent = (() => {
        const newLabel = { key: newLabelKey, value: newLabelValue };
        const allLabels = [...labels, ...(hideInitialLabels ? initialLabels : [])];
        return !!_.find(allLabels, newLabel);
    })();
    const newLabelKeyIsNotPermitted = newLabelKey.startsWith('csys-') && !reservedKeys.includes(newLabelKey);
    const addLabelNotAllowed =
        !newLabelIsProvided || newLabelIsAlreadyPresent || addingLabel || newLabelKeyIsNotPermitted;
    const duplicationErrorPopupOpen = newLabelIsProvided && newLabelIsAlreadyPresent;

    useEffect(() => {
        onChange(labels);
    }, [labels]);

    useEffect(() => {
        if (open) {
            resetNewLabelKey();
            resetNewLabelValue();
        }
    }, [open]);

    useEffect(() => {
        if (!hideInitialLabels) setLabels(initialLabels);
    }, [initialLabels]);

    useEffect(() => {
        const actions = new DeploymentActions(toolbox);
        setFetchingReservedKeys();
        actions
            .doGetReservedLabelKeys()
            .then(setReservedKeys)
            .catch(error => {
                log.error(i18n.t('widgets.common.labels.fetchingReservedKeysError'), error);
            })
            .finally(unsetFetchingReservedKeys);
    }, []);

    function onAddLabel() {
        function isLabelInSystem() {
            const actions = new DeploymentActions(toolbox);
            return actions
                .doGetLabel(newLabelKey, newLabelValue)
                .then(({ items }) => !_.isEmpty(items))
                .catch(error => {
                    log.error(i18n.t('widgets.common.labels.isLabelInSystemCheckError'), error);
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
        onAddLabel().then(() => keyDropdownRef.current.click());
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
            style={{ padding: 0, margin: 0 }}
        >
            <div role="presentation" onClick={toggleOpen} style={{ cursor: 'pointer' }}>
                {!hideInitialLabels && (
                    <RevertToDefaultIcon
                        value={labels}
                        defaultValue={initialLabels}
                        onClick={event => {
                            event.stopPropagation();
                            resetLabels();
                        }}
                        style={{ ...iconStyle, right: '2em' }}
                    />
                )}
                <Icon
                    data-cy="labels-input-switch"
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
                            {newLabelKeyIsNotPermitted && <InvalidKeyErrorPopup reservedKeys={reservedKeys} />}
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
}

LabelsInput.propTypes = {
    hideInitialLabels: PropTypes.bool,
    initialLabels: Stage.PropTypes.Labels,
    onChange: PropTypes.func.isRequired,
    toolbox: Stage.PropTypes.Toolbox.isRequired
};

LabelsInput.defaultProps = {
    hideInitialLabels: false,
    initialLabels: []
};
