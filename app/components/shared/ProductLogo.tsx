import type { CSSProperties, FunctionComponent } from 'react';
import React, { useContext, useMemo } from 'react';
import builtInLogoLightBackground from 'cloudify-ui-common-frontend/images/logo_color.png';
import builtInLogoDarkBackground from 'cloudify-ui-common-frontend/images/logo_color_dark_background.svg';
import { ThemeContext } from 'styled-components';
import { Logo } from '../basic';

interface ProductLogoProps {
    background: 'light' | 'dark';
    style?: CSSProperties;
}
const ProductLogo: FunctionComponent<ProductLogoProps> = ({ background, style }) => {
    const theme = useContext(ThemeContext) || {};
    const builtInLogo = useMemo(
        () => (background === 'light' ? builtInLogoLightBackground : builtInLogoDarkBackground),
        [background]
    );

    return <Logo url={theme.logoUrl || builtInLogo} style={style} />;
};

export default ProductLogo;
