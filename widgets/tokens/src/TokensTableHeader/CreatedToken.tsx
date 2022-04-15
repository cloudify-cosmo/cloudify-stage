import type { ReceivedToken } from './CreateTokenModal.types';
import { ButtonsWrapper } from './CreatedToken.styles';
import { translationPath } from '../widget.consts';

const {
    Basic: { Message, Button, CopyToClipboardButton },
    Utils: { getT },
    Hooks: { useBoolean }
} = Stage;

const t = getT(`${translationPath}.createModal.newToken`);

interface CreatedTokenProps {
    token: ReceivedToken;
}

const getMaskedToken = (tokenId: string) => {
    const maskPrefix = 'ctok';
    return `${maskPrefix}-${tokenId}-${'*'.repeat(8)}`;
};

const CreatedToken = ({ token }: CreatedTokenProps) => {
    const [isTokenValueVisible, showTokenValue, hideTokenValue] = useBoolean();
    const maskedTokenValue = getMaskedToken(token.id);
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
