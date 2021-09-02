import React, { useContext } from 'react';
import { ThemeContext } from 'styled-components';
import { Logo } from '../../basic';
import StageUtils from '../../../utils/stageUtils';
import LogoLabel from '../../LogoLabel';

const t = StageUtils.getT('gettingStartedModal');

const WelcomeStep = () => {
    const theme = useContext(ThemeContext);

    return (
        <div style={{ backgroundColor: theme.mainColor, textAlign: 'center', margin: -19, padding: '9em' }}>
            <Logo
                style={{
                    textAlign: 'center',
                    margin: '0 auto',
                    display: 'block',
                    width: 100,
                    height: 100
                }}
            />
            <LogoLabel color={theme.headerTextColor} content={t('welcomeLogoLabel')} />
            <pre
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
                {t('welcomeText')}
            </pre>
        </div>
    );
};

export default WelcomeStep;
