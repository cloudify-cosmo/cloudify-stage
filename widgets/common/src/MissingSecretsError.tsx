import { useMemo } from 'react';
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

const t = Stage.Utils.getT('widgets.common.deployments.deployModal');

function parseCommaSeparatedValuesInBrackets(str: string) {
    const matches = str.match(/\[(.*?)\]/);
    if (matches && matches.length > 1) {
        return matches[1].split(', ');
    }
    return [];
}

const MissingSecretsError: FunctionComponent<props> = ({ error, toolbox, onAdd }) => {
    const { useBoolean } = Stage.Hooks;
    const [secretsModalVisible, showSecretsModal, hideSecretsModal] = useBoolean(false);

    const { Button, List } = Stage.Basic;
    const secretKeys = useMemo(() => parseCommaSeparatedValuesInBrackets(error), [error]);
    return (
        <>
            <Button floated="right" color="green" style={missingSecretsButtonStyle} onClick={showSecretsModal}>
                {t('buttons.addMissingSecrets')}
            </Button>
            <p style={{ display: 'inline' }}>{t('errors.missingSecrets')}</p>
            <List bulleted>
                {secretKeys.map((secretKey: string) => (
                    <List.Item key={secretKey}>{secretKey}</List.Item>
                ))}
            </List>
            <SecretsModal
                toolbox={toolbox}
                secretKeys={secretKeys}
                open={secretsModalVisible}
                onClose={hideSecretsModal}
                onAdd={onAdd}
            />
        </>
    );
};

export default MissingSecretsError;
