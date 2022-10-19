import { useEffect, useState } from 'react';
import useManager from '../../../../utils/hooks/useManager';

const useCheckSecretsExist = (secretKeys: string[]) => {
    const manager = useManager();
    const [isAllSecretsExist, setAllSecretsExist] = useState<boolean | undefined>();

    useEffect(() => {
        manager
            .doPost('/searches/secrets', {
                body: {
                    filter_rules: []
                }
            })
            .then(response => {
                console.log('LEON DEBUG', response?.items);
                const allExistingSecrets = response?.items;
                const allExistingSecretsKeys = allExistingSecrets?.map((secret: { key: string }) => secret.key) || [];
                const secretsExist = secretKeys.every(secret => allExistingSecretsKeys.includes(secret));
                setAllSecretsExist(secretsExist);
            });
    }, []);

    return isAllSecretsExist;
};

export default useCheckSecretsExist;
