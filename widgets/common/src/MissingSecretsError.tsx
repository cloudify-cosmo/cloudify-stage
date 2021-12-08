import type { FunctionComponent } from 'react';
import SecretsModal from './SecretsModal';

const missingSecretsButtonStyle = {
    marginRight: 10
};

interface props {
    error: string;
    toolbox: Stage.Types.Toolbox;
    onAdd: () => void;
}

const missingSecretsError: FunctionComponent<props> = ({ error, toolbox, onAdd }) => {
    const { useBoolean } = Stage.Hooks;
    const [secretsModalVisible, showSecretsModal, hideSecretsModal] = useBoolean(false);

    function parseMissingSecrets() {
        // Get comma separated values inside square brackets
        const matches = error.match(/\[(.*?)\]/);
        if (matches && matches.length > 1) {
            return matches[1].split(', ');
        }
        return [];
    }

    const { Button, List } = Stage.Basic;
    const secretKeys = parseMissingSecrets();
    return (
        <>
            <Button floated="right" style={missingSecretsButtonStyle} onClick={showSecretsModal}>
                Add missing secrets
            </Button>
            <p style={{ display: 'inline' }}>The following required secrets are missing in this tenant:</p>
            <List bulleted>
                {secretKeys.map((secretKey: string) => (
                    <List.Item key={secretKey}>{secretKey}</List.Item>
                ))}
            </List>
            <SecretsModal
                toolbox={toolbox}
                secretKeys={parseMissingSecrets()}
                open={secretsModalVisible}
                onClose={hideSecretsModal}
                onAdd={onAdd}
            />
        </>
    );
};

export default missingSecretsError;
