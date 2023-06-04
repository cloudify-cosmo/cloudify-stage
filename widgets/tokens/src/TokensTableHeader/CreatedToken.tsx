import styled from 'styled-components';
import type { ReceivedToken } from './CreateTokenModal.types';
import { translationPath } from '../widget.consts';

const {
    Basic: { Message, Button, CopyToClipboardButton },
    Utils: { getT },
    Hooks: { useBoolean }
} = Stage;

const translate = getT(`${translationPath}.createModal.newToken`);

export const ButtonsWrapper = styled.span`
    margin-left: 12px;
`;

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
                {translate('content', {
                    token: displayedToken
                })}
                <ButtonsWrapper>
                    <Button
                        basic
                        compact
                        icon={isTokenValueVisible ? 'eye slash' : 'eye'}
                        onClick={isTokenValueVisible ? hideTokenValue : showTokenValue}
                    />
                    <CopyToClipboardButton text={token.value} />
                </ButtonsWrapper>
            </Message>
            <Message warning>{translate('warning')}</Message>
        </>
    );
};

export default CreatedToken;
