import AddButton from './labels/AddButton';
import LabelsList from './labels/LabelsList';
import KeyDropdown from './labels/KeyDropdown';
import ValueDropdown from './labels/ValueDropdown';
import { addSearchToUrl } from './labels/common';

const iconStyle = {
    position: 'absolute',
    top: '.7em',
    zIndex: 1
};

export default function LabelsInput({ addMode, initialLabels, onChange, toolbox }) {
    const { useEffect } = React;
    const {
        Basic: { Divider, Form, Icon, Segment },
        Common: { RevertToDefaultIcon },
        Hooks: { useResettableState, useToggle },
        Utils: { combineClassNames },
        i18n
    } = Stage;

    const [labels, setLabels, resetLabels] = useResettableState(addMode ? [] : initialLabels);
    const [open, toggleOpen] = useToggle();
    const [newLabelKey, setNewLabelKey, resetNewLabelKey] = useResettableState('');
    const [newLabelValue, setNewLabelValue, resetNewLabelValue] = useResettableState('');

    useEffect(() => {
        onChange(labels);
    }, [labels]);

    useEffect(() => {
        if (!addMode) setLabels(initialLabels);
    }, [initialLabels]);

    function isAddAllowed() {
        const label = { key: newLabelKey, value: newLabelValue };
        return newLabelKey && newLabelValue && !_.find(labels, label) && (!addMode || !_.find(initialLabels, label));
    }

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

        isLabelInSystem().then(isInSystem => {
            const newLabels = [...labels, { key: newLabelKey, value: newLabelValue, isInSystem }];
            setLabels(newLabels);
            resetNewLabelKey();
            resetNewLabelValue();
        });
    }

    return (
        <Segment
            className={combineClassNames(['dropdown', 'selection', 'fluid', open && 'active'])}
            style={{ padding: 0, margin: 0 }}
        >
            <div role="presentation" onClick={toggleOpen} style={{ cursor: 'pointer' }}>
                {!addMode && (
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
                            <KeyDropdown onChange={setNewLabelKey} toolbox={toolbox} value={newLabelKey} />
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
                            <AddButton onClick={onAddLabel} disabled={!isAddAllowed()} />
                        </Form.Field>
                    </Form.Group>
                </div>
            )}
        </Segment>
    );
}

LabelsInput.propTypes = {
    addMode: PropTypes.bool,
    initialLabels: Stage.PropTypes.Labels,
    onChange: PropTypes.func.isRequired,
    toolbox: Stage.PropTypes.Toolbox.isRequired
};

LabelsInput.defaultProps = {
    addMode: false,
    initialLabels: []
};

Stage.defineCommon({
    name: 'LabelsInput',
    common: LabelsInput
});
