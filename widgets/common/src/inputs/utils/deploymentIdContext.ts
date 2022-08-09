import { createContext } from 'react';

const DeploymentIdContext = createContext<string | undefined>(undefined);

export default DeploymentIdContext;
