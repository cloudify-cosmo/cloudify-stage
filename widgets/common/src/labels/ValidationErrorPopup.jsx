const { i18n } = Stage;

export default function ValidationErrorPopup({ open }) {
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
    open: PropTypes.bool.isRequired
};
