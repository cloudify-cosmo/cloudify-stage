export default function LabelsList({ labels, onChange }) {
    const { Label, Icon, Popup } = Stage.Basic;
    const maxLength = 20;
    const newLabelColor = 'blue';

    return (
        <div className="ui multiple dropdown" style={{ paddingRight: '4.1em', minHeight: '2em' }}>
            {_.map(labels, ({ key, value, isInSystem = true }) => {
                const truncatedKey = _.truncate(key, { length: maxLength });
                const truncatedValue = _.truncate(value, { length: maxLength });
                const allowPopup = truncatedKey !== key || truncatedValue !== value;

                return (
                    <Popup key={`${key}:${value}`} open={allowPopup ? undefined : false} wide>
                        <Popup.Trigger>
                            <Label
                                as="a"
                                color={isInSystem ? undefined : newLabelColor}
                                onClick={event => event.stopPropagation()}
                            >
                                {truncatedKey} <span style={{ fontWeight: 'lighter' }}>{truncatedValue}</span>
                                <Icon
                                    name="delete"
                                    onClick={() => onChange(_.differenceBy(labels, [{ key, value }], { key, value }))}
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
    labels: Stage.PropTypes.Labels,
    onChange: PropTypes.func.isRequired
};

LabelsList.defaultProps = {
    labels: []
};
