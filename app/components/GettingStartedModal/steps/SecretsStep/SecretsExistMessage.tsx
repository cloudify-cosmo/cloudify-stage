import React from 'react';
import { Checkbox, Message } from '../../../basic';
import StageUtils from '../../../../utils/stageUtils';

const t = StageUtils.getT('gettingStartedModal.secrets');

type SecretsExistMessageProps = {
    overrideSecrets: boolean;
    setOverrideSecrets: (overrideSecrets: boolean) => void;
};

const SecretsExistMessage = ({ overrideSecrets, setOverrideSecrets }: SecretsExistMessageProps) => {
    return (
        <Message info>
            <Message.Content>
                <Message.Header>{t('secretsAlreadyExist')}</Message.Header>
                <Checkbox
                    label={t('overrideSecrets')}
                    style={{ marginTop: 15 }}
                    checked={overrideSecrets}
                    onChange={() => setOverrideSecrets(!overrideSecrets)}
                />
            </Message.Content>
        </Message>
    );
};

export default SecretsExistMessage;
