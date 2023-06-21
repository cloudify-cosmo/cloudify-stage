import Utils from './utils';

const { Message, Icon } = Stage.Basic;
const translate = Utils.getWidgetTranslation();

const AuthenticationWarning = () => {
    return (
        <Message>
            <Icon name="ban" />
            <span>{translate('authenticationWarning')}</span>
        </Message>
    );
};

export default AuthenticationWarning;
