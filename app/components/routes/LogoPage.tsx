import type { PropsWithChildren } from 'react';
import React from 'react';
import type { MessageContainerProps } from 'cloudify-ui-components/typings/components/elements/MessageContainer/MessageContainer';
import { FullScreenSegment, Logo, MessageContainer } from '../basic';
import SplashLoadingScreen from '../../utils/SplashLoadingScreen';

export default function LogoPage({ children }: PropsWithChildren<MessageContainerProps['children']>) {
    return (
        <FullScreenSegment>
            <Logo />
            <MessageContainer onRender={SplashLoadingScreen.turnOff}>{children}</MessageContainer>
        </FullScreenSegment>
    );
}
