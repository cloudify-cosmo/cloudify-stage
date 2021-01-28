const LabelPropType = PropTypes.shape({ key: PropTypes.string, value: PropTypes.string });

export const LabelsPropType = PropTypes.arrayOf(LabelPropType);

export default function LabelsList({ labels, onChangeLabels }) {
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
