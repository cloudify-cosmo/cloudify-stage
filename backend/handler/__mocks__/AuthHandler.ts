export const isAuthorized = jest.fn(() => {
    return true;
});

export const getRBAC = jest.fn(() => {
    return Promise.resolve({ permissions: {} });
});

export const getToken = jest.fn();

export const isProductLicensed = jest.fn();

export const getManagerVersion = jest.fn();

export const getAndCacheConfig = jest.fn();

export const getLicense = jest.fn();

export const getTokenViaSamlResponse = jest.fn();
