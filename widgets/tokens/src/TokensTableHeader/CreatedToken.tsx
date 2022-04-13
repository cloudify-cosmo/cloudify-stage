import type { ReceivedToken } from './CreateTokenModal';

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
        <Message success>
            <div>
                {`New token has been created: ${displayedToken}`}
                <Button
                    basic
                    compact
                    icon={isTokenValueVisible ? 'eye slash' : 'eye'}
                    onClick={isTokenValueVisible ? hideTokenValue : showTokenValue}
                />
                <CopyToClipboardButton text={displayedToken} />
            </div>
        </Message>
    );
};

export default CreatedToken;
