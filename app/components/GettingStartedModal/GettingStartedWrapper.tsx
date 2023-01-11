import React from 'react';
import GettingStartedErrorModal from './GettingStartedErrorModal';
import GettingStartedModal from './GettingStartedModal';
import useFetchSchemas from './useFetchSchemas';

const GettingStartedWrapper = () => {
    const [gettingStartedSchema, cloudSetupSchema, error, clearError] = useFetchSchemas();

    if (error) {
        return <GettingStartedErrorModal clearError={clearError} />;
    }

    if (gettingStartedSchema && cloudSetupSchema) {
        return <GettingStartedModal gettingStartedSchema={gettingStartedSchema} cloudSetupSchema={cloudSetupSchema} />;
    }

    return null;
};

export default GettingStartedWrapper;
