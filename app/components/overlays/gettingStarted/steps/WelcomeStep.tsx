import React, { useContext } from 'react';
import { ThemeContext } from 'styled-components';
import { LargeProductLogo, LogoLabel } from 'cloudify-ui-components';
import StageUtils from '../../../../utils/stageUtils';
import renderMultilineText from '../../../../utils/shared/renderMultilineText';

const translate = StageUtils.getT('gettingStartedModal');

type WelcomeStepProps = {
    welcomeText: string;
};

const WelcomeStep = ({ welcomeText }: WelcomeStepProps) => {
    const theme = useContext(ThemeContext);

    return (
        <div style={{ backgroundColor: theme.mainColor, textAlign: 'center', margin: -19, padding: '9em' }}>
            <LargeProductLogo />
            <LogoLabel color={theme.headerTextColor} content={translate('welcomeLogoLabel')} />
            <div
                style={{
                    color: theme.headerTextColor,
                    textAlign: 'left',
                    width: 321,
                    display: 'inline-block',
                    paddingBottom: '1em',
                    marginLeft: '1em',
                    font: 'inherit'
                }}
            >
                {renderMultilineText(welcomeText)}
            </div>
        </div>
    );
};

export default WelcomeStep;
