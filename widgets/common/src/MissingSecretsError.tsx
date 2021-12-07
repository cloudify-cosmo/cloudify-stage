import type { FunctionComponent } from 'react';
import SecretsModal from './SecretsModal';

const missingSecretsButtonStyle = {
    marginRight: 10
};

interface props {
    error: string;
    toolbox: Stage.Types.Toolbox;
}

const missingSecretsError: FunctionComponent<props> = ({ error, toolbox }) => {
    const { useBoolean } = Stage.Hooks;
    const [secretsModalVisible, showSecretsModal, hideSecretsModal] = useBoolean(false);

    function parseMissingSecrets() {
        return error
            .replace('dsl_parser.exceptions.UnknownSecretError: Required secrets: [', '')
            .replace("] don't exist in this tenant", '')
            .split(',');
    }

    const { Button, List } = Stage.Basic;
    const secretKeysArr = parseMissingSecrets();
    return (
        <>
            <Button floated="right" style={missingSecretsButtonStyle} onClick={showSecretsModal}>
                Add missing secrets
            </Button>
            <p style={{ display: 'inline' }}>The following required secrets are missing in this tenant:</p>
            <List bulleted>
                {secretKeysArr.map((secretKey: string) => (
                    <List.Item key={secretKey}>{secretKey}</List.Item>
                ))}
            </List>
            <SecretsModal
                toolbox={toolbox}
                secretKeysArr={parseMissingSecrets()}
                open={secretsModalVisible}
                onClose={hideSecretsModal}
            />
        </>
    );
};

export default missingSecretsError;
