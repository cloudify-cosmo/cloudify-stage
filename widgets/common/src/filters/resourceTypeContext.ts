import { createContext } from 'react';
import { FilterResourceType } from './types';

const ResourceTypeContext = createContext<FilterResourceType | undefined>(undefined);

export default ResourceTypeContext;
