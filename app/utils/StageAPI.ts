import { ReactNode } from 'react';

import * as BasicComponents from '../components/basic';
import * as SharedComponents from '../components/shared';

export interface StageAPI {
    Basic: typeof BasicComponents;
    defineWidget: (someParam: any) => void;
    Shared: typeof SharedComponents;
    ComponentToHtmlString: (element: ReactNode) => void;
    GenericConfig: any;
    Utils: any;
    Common: any;
    defineCommon: any;
    PropTypes: any;
    definePropType: any;
    Hooks: any;
    defineHook: any;
    i18n: any;
}
