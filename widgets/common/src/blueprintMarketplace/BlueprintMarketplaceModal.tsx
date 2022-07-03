import type { FunctionComponent } from 'react';
import type { MarketplaceDisplayStyle, MarketplaceTab } from './types';

export interface BlueprintMarketplaceModalProps {
    open: boolean;
    tabs?: MarketplaceTab[];
    displayStyle?: MarketplaceDisplayStyle;
    columns?: string[];
    onHide: () => void;
}

const t = Stage.Utils.getT('widgets.common.blueprintMarketplace');
const tColumns = Stage.Utils.getT('widgets.blueprintCatalog.configuration.fieldsToShow.items');

const getPageLayout = (tabs: MarketplaceTab[], displayStyle: MarketplaceDisplayStyle, columns: string[]) => {
    const getWidgets = (tab: MarketplaceTab, index: number) => [
        {
            id: `blueprint-catalog-${index}`,
            name: t('modal.blueprintCatalogName'),
            height: 24,
            width: 12,
            definition: 'blueprintCatalog',
            configuration: {
                jsonPath: tab.url,
                displayStyle,
                fieldsToShow: columns
            },
            drillDownPages: {}
        }
    ];

    const getTabs = () =>
        tabs.map((tab, index) => ({
            name: tab.name,
            widgets: getWidgets(tab, index),
            isDefault: index === 0
        }));

    return {
        layout: [
            tabs.length > 1
                ? { type: 'tabs', content: getTabs() }
                : { type: 'widgets', content: getWidgets(tabs[0], 0) }
        ]
    };
};

const BlueprintMarketplaceModal: FunctionComponent<BlueprintMarketplaceModalProps> = ({
    open,
    onHide,
    tabs = [],
    displayStyle = 'table',
    columns = [tColumns('name'), tColumns('description')]
}) => {
    const { CancelButton, Icon, Modal } = Stage.Basic;
    const { PageContent } = Stage.Shared.Widgets;
    const onlyTabsWithUrl = tabs.filter(tab => Boolean(tab.url));

    return (
        <Modal open={open} onClose={onHide}>
            <Modal.Header>
                <Icon name="upload" /> {t(`modal.header`)}
            </Modal.Header>
            <Modal.Content>
                {onlyTabsWithUrl.length !== 0 && (
                    <PageContent page={getPageLayout(onlyTabsWithUrl, displayStyle, columns) as any} />
                )}
            </Modal.Content>
            <Modal.Actions>
                <CancelButton onClick={onHide} content={t(`modal.cancelButton`)} />
            </Modal.Actions>
        </Modal>
    );
};

export default BlueprintMarketplaceModal;
