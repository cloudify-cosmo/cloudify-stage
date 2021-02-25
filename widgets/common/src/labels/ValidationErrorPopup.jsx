function ValidationErrorPopup({ open }) {
    const {
        Basic: { Popup },
        i18n
    } = Stage;

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
    open: PropTypes.bool.isRequired
};

Stage.defineCommon({
    name: 'LabelValidationErrorPopup',
    common: ValidationErrorPopup
});
