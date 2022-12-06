import type { VersionResponse } from '../../../backend/handler/AuthHandler.types';

const versinos: Record<string, VersionResponse> = {
    premium: {
        edition: 'premium',
        version: '4.6',
        build: null,
        date: null,
        commit: null,
        distribution: 'centos',
        distro_release: 'Core'
    },
    community: {
        edition: 'community',
        version: '19.02.22~community',
        build: null,
        date: null,
        commit: null,
        distribution: 'centos',
        distro_release: 'Core'
    }
};

export default versinos;
