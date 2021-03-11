import LabelErrorPopup from './LabelErrorPopup';

export default function InvalidKeyErrorPopup({ reservedKeys }) {
    const { i18n } = Stage;

    return (
        <LabelErrorPopup
            content={i18n.t('widgets.common.labels.invalidKeyError', { reservedKeys: reservedKeys.join(', ') })}
        />
    );
}

InvalidKeyErrorPopup.propTypes = {
    reservedKeys: PropTypes.arrayOf(PropTypes.string).isRequired
};
