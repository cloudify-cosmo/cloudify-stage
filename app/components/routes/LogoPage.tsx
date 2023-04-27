import type { PropsWithChildren } from 'react';
import React from 'react';
import type { MessageContainerProps } from 'cloudify-ui-components/typings/components/elements/MessageContainer/MessageContainer';
import { LogoPage as CommonLogoPage } from 'cloudify-ui-components';
import SplashLoadingScreen from '../../utils/SplashLoadingScreen';

export default function LogoPage({ children }: PropsWithChildren<MessageContainerProps['children']>) {
    return <CommonLogoPage onRender={SplashLoadingScreen.turnOff}>{children}</CommonLogoPage>;
}
