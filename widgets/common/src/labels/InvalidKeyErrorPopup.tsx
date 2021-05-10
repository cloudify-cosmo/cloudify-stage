import LabelErrorPopup from './LabelErrorPopup';

export default function InvalidKeyErrorPopup({ keyPrefix, reservedKeys }) {
    const { i18n } = Stage;

    return (
        <LabelErrorPopup
            content={i18n.t('widgets.common.labels.invalidKeyError', {
                keyPrefix,
                reservedKeys: reservedKeys.join(', ')
            })}
        />
    );
}

InvalidKeyErrorPopup.propTypes = {
    keyPrefix: PropTypes.string.isRequired,
    reservedKeys: PropTypes.arrayOf(PropTypes.string).isRequired
};
