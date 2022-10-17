import React, { useContext } from 'react';
import { ThemeContext } from 'styled-components';
import StageUtils from '../../../utils/stageUtils';
import LogoLabel from '../../banner/LogoLabel';
import LargeLogo from '../../banner/LargeLogo';
import renderMultilineText from '../../../utils/shared/renderMultilineText';
import type { GettingStartedSchema } from '../model';

const t = StageUtils.getT('gettingStartedModal');

type WelcomeStepProps = {
    schema: GettingStartedSchema;
};

const WelcomeStep = ({ schema }: WelcomeStepProps) => {
    const theme = useContext(ThemeContext);

    return (
        <div style={{ backgroundColor: theme.mainColor, textAlign: 'center', margin: -19, padding: '9em' }}>
            <LargeLogo />
            <LogoLabel color={theme.headerTextColor} content={t('welcomeLogoLabel')} />
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
                {renderMultilineText(schema.welcomeText)}
            </div>
        </div>
    );
};

export default WelcomeStep;
