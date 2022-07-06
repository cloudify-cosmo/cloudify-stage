import { useState } from 'react';
import { useSelector } from 'react-redux';
import type { TabContent } from '../actions/page';
import type { ReduxState } from '../reducers';

const defaultTabNameContextParameter = 'defaultTab';

interface TabsContext {
    [defaultTabNameContextParameter]?: string;
}

const getDefaultTabIndex = (tabs: TabContent[], defaultTab?: string): number => {
    if (defaultTab) {
        const namedTabIndex = tabs.findIndex(tab => tab.name === defaultTab);
        if (namedTabIndex >= 0) {
            return namedTabIndex;
        }
    }

    const defaultTabIndex = tabs.findIndex(tab => !!tab.isDefault);
    return Math.max(defaultTabIndex, 0);
};

const useDefaultTabIndex = (tabs: TabContent[]) => {
    const { defaultTab } = useSelector((state: ReduxState) => state.context as TabsContext);
    return useState(() => getDefaultTabIndex(tabs, defaultTab));
};

export default useDefaultTabIndex;
