import React from 'react';
import { Checkbox, Message } from '../../../basic';
import StageUtils from '../../../../utils/stageUtils';

const t = StageUtils.getT('gettingStartedModal.secrets');

type SecretsAlreadyExistProps = {
    overrideSecrets: boolean;
    setOverrideSecrets: (overrideSecrets: boolean) => void;
};

const SecretsAlreadyExist = ({ overrideSecrets, setOverrideSecrets }: SecretsAlreadyExistProps) => {
    return (
        <Message warning>
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

export default SecretsAlreadyExist;
