import type { ReceivedToken } from './CreateTokenModal';
import { ButtonsWrapper } from './CreatedToken.styles';

const {
    Basic: { Message, Button, CopyToClipboardButton },
    Utils: { getT },
    Hooks: { useBoolean }
} = Stage;

// TODO: Extract as an getTokensTranslation util
const t = getT('widget.tokens.createModal.newToken');

interface CreatedTokenProps {
    token: ReceivedToken;
}

const CreatedToken = ({ token }: CreatedTokenProps) => {
    const [isTokenValueVisible, showTokenValue, hideTokenValue] = useBoolean();
    const maskedTokenValue = `ctok-${token.id}-${'*'.repeat(8)}`;
    const displayedToken = isTokenValueVisible ? token.value : maskedTokenValue;

    return (
        <>
            <Message success>
                {t('content', {
                    token: displayedToken
                })}
                <ButtonsWrapper>
                    <Button
                        basic
                        compact
                        icon={isTokenValueVisible ? 'eye slash' : 'eye'}
                        onClick={isTokenValueVisible ? hideTokenValue : showTokenValue}
                    />
                    <CopyToClipboardButton text={displayedToken} />
                </ButtonsWrapper>
            </Message>
            <Message warning>{t('warning')}</Message>
        </>
    );
};

export default CreatedToken;
