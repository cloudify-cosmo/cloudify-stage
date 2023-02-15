import type { ProviderOptions } from 'app/widgets/common/secrets/SecretActions';

export const translateSecrets = Stage.Utils.getT('widgets.secrets');
export const translateForm = Stage.Utils.getT('widgets.secrets.form');

export const getSecretProviderOptions = (path: string): ProviderOptions => ({ path });
