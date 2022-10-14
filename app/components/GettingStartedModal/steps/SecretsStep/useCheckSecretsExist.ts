import { useEffect, useState } from 'react';
import { useManagerFetch } from '../../common/fetchHooks';
import type { SecretsResponse } from '../../secrets/model';

const useCheckSecretsExist = (secretKeys: string[]) => {
    const [isAllSecretsExist, setAllSecretsExist] = useState<boolean | undefined>();
    const managerSecrets = useManagerFetch<SecretsResponse>('/secrets?_include=key,visibility');

    useEffect(() => {
        const allExistingSecrets = managerSecrets.response?.items;
        const allExistingSecretsKeys = allExistingSecrets?.map((secret: { key: string }) => secret.key) || [];
        const secretsExist = secretKeys.every(secret => allExistingSecretsKeys.includes(secret));
        setAllSecretsExist(secretsExist);
    }, [managerSecrets]);

    return isAllSecretsExist;
};

export default useCheckSecretsExist;
