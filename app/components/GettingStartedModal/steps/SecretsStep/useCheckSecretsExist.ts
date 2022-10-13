import { useEffect, useState } from 'react';
import { useManagerFetch } from '../../common/fetchHooks';
import type { SecretsResponse } from '../../secrets/model';

const useCheckSecretsExist = (defaultSecretInputs: Record<string, any>) => {
    const [isSecretsExist, setSecretsExist] = useState<boolean | undefined>();
    const [existingSecrets, setExistingSecrets] = useState<string[]>([]);
    const managerSecrets = useManagerFetch<SecretsResponse>('/secrets?_include=key,visibility');

    useEffect(() => {
        const allExistingSecrets = managerSecrets.response?.items;
        const allExistingSecretsKeys = allExistingSecrets?.map((secret: { key: string }) => secret.key) || [];
        setExistingSecrets(allExistingSecretsKeys);
        const defaultSecretInputsKeys = Object.keys(defaultSecretInputs);
        const secretsExist = allExistingSecretsKeys?.some(secret => defaultSecretInputsKeys.includes(secret));
        setSecretsExist(secretsExist);
    }, [managerSecrets]);

    return { isSecretsExist, existingSecrets };
};

export default useCheckSecretsExist;
