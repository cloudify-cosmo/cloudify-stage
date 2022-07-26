import type { getConfig, getClientConfig } from '../config';

export type Config = ReturnType<typeof getConfig>;
export type ClientConfig = ReturnType<typeof getClientConfig>;
