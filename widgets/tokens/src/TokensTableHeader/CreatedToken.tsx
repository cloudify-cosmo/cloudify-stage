import type { ReceivedToken } from './CreateTokenModal';
import { ButtonsWrapper } from './CreatedToken.styles';

const {
    Basic: { Message, Button, CopyToClipboardButton },
    Hooks: { useBoolean }
} = Stage;

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
                {`New token has been created: ${displayedToken}`}
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
            <Message warning>You won't be able to show or copy the token value after closing this modal</Message>
        </>
    );
};

export default CreatedToken;
