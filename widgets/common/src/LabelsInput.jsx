import AddButton from './labels/AddButton';
import LabelsList, { LabelsPropType } from './labels/LabelsList';
import KeyDropdown from './labels/KeyDropdown';
import ValueDropdown from './labels/ValueDropdown';
import { addSearchToUrl } from './labels/common';

export default function LabelsInput({ initialValue, onChange, toolbox }) {
    const { useEffect } = React;
    const {
        Basic: { Divider, Form, Icon, Segment },
        Common: { RevertToDefaultIcon },
        Hooks: { useBoolean, useResettableState }
    } = Stage;

    const [labels, setLabels, resetLabels] = useResettableState(initialValue);
    const [open, setOpen, unsetOpen] = useBoolean();
    const [newLabelKey, setNewLabelKey, resetNewLabelKey] = useResettableState('');
    const [newLabelValue, setNewLabelValue, resetNewLabelValue] = useResettableState('');

    const iconStyle = {
        position: 'absolute',
        top: '.7em',
        zIndex: 1
    };

    useEffect(() => {
        onChange(labels);
    }, [labels]);

    useEffect(() => {
        setLabels(initialValue);
    }, [initialValue]);

    function onChangeLabelKey(labelKey) {
        setNewLabelKey(labelKey);
        resetNewLabelValue();
    }

    function onChangeLabelValue(labelValue) {
        setNewLabelValue(labelValue);
    }

    function isAddAllowed() {
        const isLabelInList = _.findIndex(labels, { key: newLabelKey, value: newLabelValue }) >= 0;
        const isNewKeyProvided = newLabelKey !== '';
        const isNewValueProvided = newLabelValue !== '';

        return !isLabelInList && isNewKeyProvided && isNewValueProvided;
    }

    function onAddLabel() {
        function isLabelInSystem() {
            const fetchUrl = addSearchToUrl(`/labels/deployments/${newLabelKey}`, newLabelValue);
            return toolbox
                .getManager()
                .doGet(fetchUrl)
                .then(({ items }) => !_.isEmpty(items))
                .catch(() => false);
        }

        isLabelInSystem().then(isInSystem => {
            const newLabels = [...labels, { key: newLabelKey, value: newLabelValue, isInSystem }];
            setLabels(newLabels);
            resetNewLabelKey();
            resetNewLabelValue();
        });
    }

    return (
        <Segment className={`dropdown selection fluid ${open && 'active'}`} style={{ padding: 0 }}>
            <div role="presentation" onClick={open ? unsetOpen : setOpen} style={{ cursor: 'pointer' }}>
                <RevertToDefaultIcon
                    value={labels}
                    defaultValue={initialValue}
                    onClick={event => {
                        event.stopPropagation();
                        resetLabels();
                    }}
                    style={{ ...iconStyle, right: '2em' }}
                />
                <Icon
                    name="dropdown"
                    link
                    onClick={open ? unsetOpen : setOpen}
                    style={{ ...iconStyle, right: '0.5em' }}
                />
                <LabelsList labels={labels} onChange={setLabels} />
            </div>
            {open && (
                <div style={{ padding: '0 0.5em' }}>
                    <Divider hidden={_.isEmpty(labels)} />
                    <Form.Group>
                        <Form.Field width={7}>
                            <KeyDropdown onChange={onChangeLabelKey} toolbox={toolbox} value={newLabelKey} />
                        </Form.Field>
                        <Form.Field width={7}>
                            <ValueDropdown
                                labelKey={newLabelKey}
                                onChange={onChangeLabelValue}
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
    initialValue: LabelsPropType,
    onChange: PropTypes.func.isRequired,
    toolbox: Stage.PropTypes.Toolbox.isRequired
};

LabelsInput.defaultProps = {
    initialValue: []
};

Stage.defineCommon({
    name: 'LabelsInput',
    common: LabelsInput
});
