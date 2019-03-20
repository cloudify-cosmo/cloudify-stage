export default {
    activePayingLicense: {
        expiration_date: '2019-11-24T00:00:00.000Z',
        cloudify_version: '4.6',
        license_edition: 'Spire',
        capabilities: [
            'HA',
            'Awesomeness'
        ],
        trial: false,
        customer_id: 'customer123',
        expired: false
    },
    expiredPayingLicense: {
        expiration_date: '2018-11-24T00:00:00.000Z',
        cloudify_version: '4.6',
        license_edition: 'Spire',
        capabilities: [
            'HA',
            'Awesomeness'
        ],
        trial: false,
        customer_id: 'customer123',
        expired: true
    },
    activeTrialLicense: {
        expiration_date: '2019-11-24T00:00:00.000Z',
        cloudify_version: '4.6',
        license_edition: 'Spire',
        capabilities: [
            'HA',
            'Awesomeness'
        ],
        trial: true,
        customer_id: 'customer123',
        expired: true
    },
    expiredTrialLicense: {
        expiration_date: '2018-11-24T00:00:00.000Z',
        cloudify_version: '4.6',
        license_edition: 'Spire',
        capabilities: [
            'HA',
            'Awesomeness'
        ],
        trial: true,
        customer_id: 'customer123',
        expired: true
    }
}