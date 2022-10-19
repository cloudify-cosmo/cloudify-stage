import { useEffect, useState } from 'react';
import useManager from '../../../../utils/hooks/useManager';

const useCheckSecretsExist = (secretKeys: string[]) => {
    const manager = useManager();
    const [isAllSecretsExist, setAllSecretsExist] = useState<boolean | undefined>();

    useEffect(() => {
        const searchSecrets = async () => {
            const response = await manager.doPost('/searches/secrets', {
                body: {
                    filter_rules: [
                        {
                            key: 'key',
                            values: secretKeys,
                            operator: 'contains',
                            type: 'attribute'
                        }
                    ]
                }
            });
            const secretsExist = response?.items.length === secretKeys.length;
            setAllSecretsExist(secretsExist);
        };

        searchSecrets();
    }, []);

    return isAllSecretsExist;
};

export default useCheckSecretsExist;
