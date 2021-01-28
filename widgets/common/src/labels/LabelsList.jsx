const LabelPropType = PropTypes.shape({ key: PropTypes.string, value: PropTypes.string, isInSystem: PropTypes.bool });

export const LabelsPropType = PropTypes.arrayOf(LabelPropType);

export default function LabelsList({ labels, onChange }) {
    const { Label, Icon, Popup } = Stage.Basic;
    const maxLength = 20;
    const newLabelColor = 'blue';

    return (
        <div className="ui multiple dropdown" style={{ paddingRight: '4.1em', minHeight: '2em' }}>
            {_.map(labels, ({ key, value, isInSystem = true }) => {
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
                                color={!isInSystem ? newLabelColor : undefined}
                                onClick={event => event.stopPropagation()}
                            >
                                {truncatedKey} <span style={{ fontWeight: 'lighter' }}>{truncatedValue}</span>
                                <Icon
                                    name="delete"
                                    onClick={() =>
                                        onChange(
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
    onChange: PropTypes.func.isRequired
};

LabelsList.defaultProps = {
    labels: []
};
