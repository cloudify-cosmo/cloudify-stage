import type { FunctionComponent } from 'react';
import { MarketplaceTab } from './types';

interface BlueprintMarketplaceModalProps {
    open: boolean;
    tabs: MarketplaceTab[];
    onHide: () => void;
}

const t = Stage.Utils.getT('widgets.common.blueprintMarketplace');

const getPageLayout = (tabs: MarketplaceTab[]) => ({
    layout: [
        {
            type: 'tabs',
            content: tabs.map((tab, index) => ({
                name: tab.name,
                widgets: [
                    {
                        id: `blueprint-catalog-${index}`,
                        name: t('modal.blueprintCatalogName'),
                        height: 24,
                        maximized: true,
                        definition: 'blueprintCatalog',
                        configuration: {
                            jsonPath: tab.url,
                            displayStyle: 'catalog'
                        },
                        drillDownPages: {}
                    }
                ],
                isDefault: true
            }))
        }
    ]
});

const BlueprintMarketplaceModal: FunctionComponent<BlueprintMarketplaceModalProps> = ({ open, onHide, tabs }) => {
    const { CancelButton, Icon, Modal } = Stage.Basic;
    const { PageContent } = Stage.Shared.Widgets;
    const onlyTabsWithUrl = tabs.filter(tab => Boolean(tab.url));

    return (
        <Modal open={open} onClose={onHide}>
            <Modal.Header>
                <Icon name="upload" /> {t(`modal.header`)}
            </Modal.Header>
            <Modal.Content>
                {onlyTabsWithUrl.length !== 0 && <PageContent page={getPageLayout(onlyTabsWithUrl) as any} />}
            </Modal.Content>
            <Modal.Actions>
                <CancelButton onClick={onHide} content={t(`modal.cancelButton`)} />
            </Modal.Actions>
        </Modal>
    );
};

export default BlueprintMarketplaceModal;
