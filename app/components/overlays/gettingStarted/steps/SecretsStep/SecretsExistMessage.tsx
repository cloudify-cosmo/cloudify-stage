import React from 'react';
import { Checkbox, Message } from '../../../../basic';
import StageUtils from '../../../../../utils/stageUtils';

const translate = StageUtils.getT('gettingStartedModal.secrets');

type SecretsExistMessageProps = {
    overrideSecrets: boolean;
    setOverrideSecrets: (overrideSecrets: boolean) => void;
};

const SecretsExistMessage = ({ overrideSecrets, setOverrideSecrets }: SecretsExistMessageProps) => {
    return (
        <Message warning>
            <Message.Content>
                <Message.Header>{translate('secretsAlreadyExist')}</Message.Header>
                <Checkbox
                    label={translate('overrideSecrets')}
                    style={{ marginTop: 15 }}
                    checked={overrideSecrets}
                    onChange={() => setOverrideSecrets(!overrideSecrets)}
                />
            </Message.Content>
        </Message>
    );
};

export default SecretsExistMessage;
