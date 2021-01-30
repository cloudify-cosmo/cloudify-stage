import { ReactNode } from 'react';

import * as BasicComponents from '../components/basic';
import * as SharedComponents from '../components/shared';

export interface StageAPI {
    Basic: typeof BasicComponents;
    defineWidget: (widgetConfiguration: any) => void;
    Shared: typeof SharedComponents;
    ComponentToHtmlString: (element: ReactNode) => void;
    GenericConfig: any;
    Utils: any;
    Common: any;
    defineCommon: (definition: any) => void;
    PropTypes: any;
    definePropType: (definition: any) => void;
    Hooks: any;
    defineHook: (definition: any) => void;
    i18n: any;
}
