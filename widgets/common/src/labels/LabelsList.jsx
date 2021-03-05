export default function LabelsList({ labels, onChange }) {
    const { Label, Icon } = Stage.Basic;
    const newLabelColor = 'blue';

    return (
        <div
            className="ui multiple dropdown"
            /* maxHeight set to 8.2em guarantees 4 lines of labels to be visible without scroller */
            style={{ paddingRight: '4.1em', minHeight: '2em', maxHeight: '8.2em', overflow: 'auto', maxWidth: '100%' }}
        >
            {_.map(labels, ({ key, value, isInSystem = true }) => {
                return (
                    <Label
                        as="a"
                        color={isInSystem ? undefined : newLabelColor}
                        onClick={event => event.stopPropagation()}
                    >
                        {key} <span style={{ fontWeight: 'lighter' }}>{value}</span>
                        <Icon
                            name="delete"
                            onClick={() => onChange(_.differenceBy(labels, [{ key, value }], { key, value }))}
                        />
                    </Label>
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
