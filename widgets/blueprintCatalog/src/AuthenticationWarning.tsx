import Utils from './utils';

const { Message, Icon } = Stage.Basic;
const t = Utils.getWidgetTranslation();

const AuthenticationWarning = () => {
    return (
        <Message>
            <Icon name="ban" />
            <span>{t('authenticationWarning')}</span>
        </Message>
    );
};

export default AuthenticationWarning;
