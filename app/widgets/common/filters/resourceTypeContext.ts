import { createContext } from 'react';
import type { FilterResourceType } from './types';

const ResourceTypeContext = createContext<FilterResourceType | undefined>(undefined);

export default ResourceTypeContext;
