import Modal from './BlueprintMarketplaceModal';
import tabsConfig from './blueprintMarketplaceTabsConfig';
import { MarketplaceDisplayStyle, MarketplaceTab } from './types';

const BlueprintMarketplace = {
    Modal,
    tabsConfig
};

declare global {
    namespace Stage.Common {
        namespace BlueprintMarketplace {
            export type Tab = MarketplaceTab;
            export type DisplayStyle = MarketplaceDisplayStyle;
            export { Modal, tabsConfig };
        }
    }
}

Stage.defineCommon({
    name: 'BlueprintMarketplace',
    common: BlueprintMarketplace
});
