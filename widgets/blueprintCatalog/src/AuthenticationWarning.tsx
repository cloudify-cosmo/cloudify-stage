const { Message, Icon } = Stage.Basic;

const t = Stage.Utils.getT('widgets.blueprintCatalog');

const AuthenticationWarning = () => {
    return (
        <Message>
            <Icon name="ban" />
            <span>{t('authenticationWarning')}</span>
        </Message>
    );
};

export default AuthenticationWarning;
