const {
    i18n,
    Hooks: { useBoolean, useResettableState }
} = Stage;

const LabelPropType = PropTypes.shape({ key: PropTypes.string, value: PropTypes.string });
const LabelsPropType = PropTypes.arrayOf(LabelPropType);

function onSearchChange(onChange, setSearchQuery, setShowError, unsetShowError, resetSelectedValue, setTypedValue) {
    const allowedCharacters = /^[a-z0-9_-]*$/i;

    return (event, { searchQuery: newTypedValue }) => {
        const lowercasedNewTypedValue = _.toLower(newTypedValue);
        if (allowedCharacters.test(lowercasedNewTypedValue)) {
            resetSelectedValue();
            setTypedValue(lowercasedNewTypedValue);
            onChange(lowercasedNewTypedValue);
            unsetShowError();
        } else {
            setShowError();
        }
    };
}

function onValueChange(onChange, unsetShowError, resetTypedValue, setSelectedValue) {
    return value => {
        resetTypedValue();
        setSelectedValue(value);
        onChange(value);
        unsetShowError();
    };
}

function useResetValues(value, selectedValue, typedValue, resetSelectedValue, resetTypedValue) {
    React.useEffect(() => {
        if (value === '') {
            resetSelectedValue();
            resetTypedValue();
        }
    }, [value]);
}

function addSearchToUrl(url, search) {
    return search ? `${url}?_search=${search}` : url;
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

function LabelKeyDropdown({ onChange, toolbox, value }) {
    const [selectedValue, setSelectedValue, resetSelectedValue] = useResettableState('');
    const [typedValue, setTypedValue, resetTypedValue] = useResettableState('');
    const [showError, setShowError, unsetShowError] = useBoolean();

    const { DynamicDropdown } = Stage.Common;

    const fetchUrl = addSearchToUrl('/labels/deployments', typedValue);

    useResetValues(value, selectedValue, typedValue, resetSelectedValue, resetTypedValue);

    return (
        <>
            <ValidationErrorPopup open={showError} />

            <DynamicDropdown
                clearable={false}
                fetchAll
                fetchUrl={fetchUrl}
                name="labelKey"
                noResultsMessage={value ? i18n.t('widgets.common.labels.newKey') : undefined}
                onChange={onValueChange(onChange, unsetShowError, resetTypedValue, setSelectedValue)}
                onSearchChange={onSearchChange(
                    onChange,
                    setTypedValue,
                    setShowError,
                    unsetShowError,
                    resetSelectedValue,
                    setTypedValue
                )}
                placeholder={i18n.t('widgets.common.labels.keyPlaceholder')}
                searchQuery={typedValue}
                toolbox={toolbox}
                value={selectedValue}
                valueProp=""
                tabIndex={0}
            />
        </>
    );
}

LabelKeyDropdown.propTypes = {
    onChange: PropTypes.func,
    toolbox: Stage.PropTypes.Toolbox.isRequired,
    value: PropTypes.string
};

LabelKeyDropdown.defaultProps = {
    onChange: _.noop,
    value: null
};

function LabelValueDropdown({ labelKey, onChange, toolbox, value }) {
    const [selectedValue, setSelectedValue, resetSelectedValue] = useResettableState('');
    const [typedValue, setTypedValue, resetTypedValue] = useResettableState('');
    const [showError, setShowError, unsetShowError] = useBoolean();

    const { DynamicDropdown } = Stage.Common;
    useResetValues(value, selectedValue, typedValue, resetSelectedValue, resetTypedValue);

    const fetchUrl = addSearchToUrl(`/labels/deployments/${labelKey}`, typedValue);

    return (
        <>
            <ValidationErrorPopup open={showError} />

            <DynamicDropdown
                clearable={false}
                disabled={!labelKey}
                fetchAll
                fetchUrl={fetchUrl}
                name="labelValue"
                noResultsMessage={value ? i18n.t('widgets.common.labels.newValue') : undefined}
                onChange={onValueChange(onChange, unsetShowError, resetTypedValue, setSelectedValue)}
                onSearchChange={onSearchChange(
                    onChange,
                    setTypedValue,
                    setShowError,
                    unsetShowError,
                    resetSelectedValue,
                    setTypedValue
                )}
                placeholder={i18n.t('widgets.common.labels.valuePlaceholder')}
                searchQuery={typedValue}
                toolbox={toolbox}
                value={selectedValue}
                valueProp=""
                tabIndex={labelKey ? 0 : -1}
            />
        </>
    );
}

LabelValueDropdown.propTypes = {
    labelKey: PropTypes.string,
    onChange: PropTypes.func,
    toolbox: Stage.PropTypes.Toolbox.isRequired,
    value: PropTypes.string
};

LabelValueDropdown.defaultProps = {
    labelKey: '',
    onChange: _.noop,
    value: null
};

function LabelAddButton({ disabled, onClick }) {
    const { Button } = Stage.Basic;

    return <Button icon="add" onClick={onClick} disabled={disabled} fluid />;
}

LabelAddButton.propTypes = {
    disabled: PropTypes.bool,
    onClick: PropTypes.func
};

LabelAddButton.defaultProps = {
    disabled: false,
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
            {_.map(labels, ({ key, value, isUsed }) => {
                const truncatedKey = _.truncate(key, { length: maxLength });
                const truncatedValue = _.truncate(value, { length: maxLength });

                return (
                    <Popup
                        key={`${key}:${value}`}
                        open={truncatedKey === key && truncatedValue === value ? false : undefined}
                        wide
                    >
                        <Popup.Trigger>
                            <Label
                                as="a"
                                color={!isUsed ? 'green' : undefined}
                                onClick={event => event.stopPropagation()}
                            >
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

    const iconStyle = {
        position: 'absolute',
        top: '.7em',
        zIndex: 1
    };

    function isNewLabelPresent() {
        return _.findIndex(labels, { key: newLabelKey, value: newLabelValue }) >= 0;
    }

    function areNewKeyAndValueEmpty() {
        return !newLabelKey || !newLabelValue;
    }

    async function isNewLabelUsed() {
        const fetchUrl = addSearchToUrl(`/labels/deployments/${newLabelKey}`, newLabelValue);
        return toolbox
            .getManager()
            .doGet(fetchUrl)
            .then(({ items }) => !_.isEmpty(items))
            .catch(() => false);
    }

    async function onAddLabel() {
        if (!areNewKeyAndValueEmpty() && !isNewLabelPresent()) {
            isNewLabelUsed().then(isUsed => {
                const newLabels = [...labels, { key: newLabelKey, value: newLabelValue, isUsed }];
                setLabels(newLabels);
                resetNewLabelKey();
                resetNewLabelValue();
            });
        }
    }

    function onChangeLabelValue(labelValue) {
        setNewLabelValue(labelValue);
    }

    function onChangeLabelKey(labelKey) {
        setNewLabelKey(labelKey);
        resetNewLabelValue();
    }

    return (
        <StyledSegment open={open}>
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
                <LabelsList labels={labels} onChangeLabels={setLabels} />
            </div>
            {open && (
                <div style={{ padding: '0 0.5em' }}>
                    <Divider hidden={_.isEmpty(labels)} />
                    <Form.Group>
                        <Form.Field width={7}>
                            <LabelKeyDropdown onChange={onChangeLabelKey} toolbox={toolbox} value={newLabelKey} />
                        </Form.Field>
                        <Form.Field width={7}>
                            <LabelValueDropdown
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
    initialValue: LabelsPropType
};

LabelsInput.defaultProps = {
    initialValue: []
};

Stage.defineCommon({
    name: 'LabelsInput',
    common: LabelsInput
});
