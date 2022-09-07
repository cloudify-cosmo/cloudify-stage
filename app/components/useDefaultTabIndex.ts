import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import type { TabContent } from '../actions/page';
import type { ReduxState } from '../reducers';

interface TabsContext {
    defaultTab?: string;
}

const tabNamesAreMatching = (tabName: string, comparingName: string): boolean => {
    return tabName.toLowerCase() === comparingName.toLowerCase();
};

const getDefaultTabIndex = (tabs: TabContent[], defaultTab?: string): number => {
    if (defaultTab) {
        const namedTabIndex = tabs.findIndex(tab => tabNamesAreMatching(tab.name, defaultTab));

        if (namedTabIndex >= 0) {
            return namedTabIndex;
        }
    }

    const defaultTabIndex = tabs.findIndex(tab => !!tab.isDefault);
    return Math.max(defaultTabIndex, 0);
};

const useDefaultTabIndex = (tabs: TabContent[]) => {
    const { defaultTab } = useSelector((state: ReduxState) => state.context as TabsContext);
    const [tabIndex, setTabIndex] = useState(() => getDefaultTabIndex(tabs, defaultTab));

    useEffect(() => {
        setTabIndex(getDefaultTabIndex(tabs, defaultTab));
    }, [defaultTab]);

    return [tabIndex, setTabIndex] as const;
};

export default useDefaultTabIndex;
