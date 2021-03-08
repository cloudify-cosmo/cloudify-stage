import AddButton from './AddButton';
import LabelsList from './LabelsList';
import KeyDropdown from './KeyDropdown';
import ValueDropdown from './ValueDropdown';
import { addSearchToUrl } from './common';

const iconStyle = {
    position: 'absolute',
    top: '.7em',
    zIndex: 1
};

export default function LabelsInput({ hideInitialLabels, initialLabels, onChange, toolbox }) {
    const { useRef, useEffect } = React;
    const {
        Basic: { Divider, Form, Icon, Popup, Segment },
        Common: { RevertToDefaultIcon },
        Hooks: { useBoolean, useResettableState, useToggle },
        Utils: { combineClassNames },
        i18n
    } = Stage;

    const [addingLabel, setAddingLabel, unsetAddingLabel] = useBoolean();
    const [labels, setLabels, resetLabels] = useResettableState(hideInitialLabels ? [] : initialLabels);
    const [open, toggleOpen] = useToggle();
    const [newLabelKey, setNewLabelKey, resetNewLabelKey] = useResettableState('');
    const [newLabelValue, setNewLabelValue, resetNewLabelValue] = useResettableState('');
    const keyDropdownRef = useRef();

    const newLabelIsProvided = !!newLabelKey && !!newLabelValue;
    const newLabelIsAlreadyPresent = (function isNewLabelAlreadyPresent() {
        const label = { key: newLabelKey, value: newLabelValue };
        return !!(_.find(labels, label) || (hideInitialLabels && _.find(initialLabels, label)));
    })();
    const addLabelNotAllowed = !newLabelIsProvided || newLabelIsAlreadyPresent || addingLabel;
    const addButtonPopupOpen = newLabelIsProvided && newLabelIsAlreadyPresent;

    useEffect(() => {
        onChange(labels);
    }, [labels]);

    useEffect(() => {
        if (!hideInitialLabels) setLabels(initialLabels);
    }, [initialLabels]);

    useEffect(() => {
        resetNewLabelValue();
    }, [newLabelKey]);

    function onAddLabel() {
        function isLabelInSystem() {
            const fetchUrl = addSearchToUrl(`/labels/deployments/${newLabelKey}`, newLabelValue);
            return toolbox
                .getManager()
                .doGet(fetchUrl)
                .then(({ items }) => !_.isEmpty(items))
                .catch(error => {
                    log.error(i18n.t('widgets.common.labels.isLabelInSystemCheckError'), error);
                    return false;
                });
        }

        setAddingLabel();
        isLabelInSystem().then(isInSystem => {
            const newLabels = [...labels, { key: newLabelKey, value: newLabelValue, isInSystem }];
            setLabels(newLabels);
            resetNewLabelKey();
            resetNewLabelValue();
            unsetAddingLabel();
        });
    }

    function onEnterPressOnAddButton() {
        onAddLabel();
        keyDropdownRef.current.click();
    }

    return (
        <Segment
            className={combineClassNames(['dropdown', 'selection', 'fluid', open && 'active'])}
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
                <Icon name="dropdown" link onClick={toggleOpen} style={{ ...iconStyle, right: '0.5em' }} />
                <LabelsList labels={labels} onChange={setLabels} />
            </div>
            {open && (
                <div style={{ padding: '0 0.5em' }}>
                    <Divider hidden={_.isEmpty(labels)} />
                    <Form.Group>
                        <Form.Field width={7}>
                            <KeyDropdown
                                innerRef={keyDropdownRef}
                                onChange={setNewLabelKey}
                                toolbox={toolbox}
                                value={newLabelKey}
                            />
                        </Form.Field>
                        <Form.Field width={7}>
                            <ValueDropdown
                                labelKey={newLabelKey}
                                onChange={setNewLabelValue}
                                toolbox={toolbox}
                                value={newLabelValue}
                            />
                        </Form.Field>
                        <Form.Field width={2}>
                            <Popup
                                open={addButtonPopupOpen}
                                content={i18n.t('widgets.common.labels.labelDuplicationError')}
                                trigger={
                                    <AddButton
                                        onClick={onAddLabel}
                                        onEnterPress={onEnterPressOnAddButton}
                                        disabled={addLabelNotAllowed}
                                    />
                                }
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
