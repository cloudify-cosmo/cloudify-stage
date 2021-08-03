import type { FunctionComponent } from 'react';

import { noop } from 'lodash';

interface Tab {
    name: string;
    url: string;
}

interface BlueprintMarketplaceModalProps {
    open: boolean;
    tabs: Tab[];
    onHide: () => void;
}

const getPageLayout = (tabs: Tab[]) => ({
    name: 'details-pane-widgets',
    layout: [
        {
            type: 'tabs',
            content: tabs.map((tab, index) => ({
                name: tab.name,
                widgets: [
                    {
                        id: index.toString(),
                        showBorder: false,
                        name: 'Blueprints Catalog',
                        x: 0,
                        y: 0,
                        width: 12,
                        height: 24,
                        definition: 'blueprintCatalog',
                        configuration: {
                            jsonPath: tab.url,
                            displayStyle: 'catalog'
                        },
                        drillDownPages: {},
                        maximized: false
                    }
                ],
                isDefault: true
            }))
        }
    ]
});

const BlueprintMarketplaceModal: FunctionComponent<BlueprintMarketplaceModalProps> = ({ open, onHide, tabs }) => {
    const { getT } = Stage.Utils;
    const t = getT('widgets.common.blueprintMarketPlace');

    const { CancelButton, Icon, Modal } = Stage.Basic;
    const { PageContent } = Stage.Shared.Widgets;

    return (
        <div>
            <Modal open={open} onClose={onHide}>
                <Modal.Header>
                    <Icon name="upload" /> {t(`modal.header`)}
                </Modal.Header>
                <Modal.Content>
                    <PageContent page={getPageLayout(tabs) as any} />
                </Modal.Content>
                <Modal.Actions>
                    <CancelButton onClick={onHide} disabled={false} />
                </Modal.Actions>
            </Modal>
        </div>
    );
};

BlueprintMarketplaceModal.propTypes = {
    open: PropTypes.bool.isRequired,
    onHide: PropTypes.func.isRequired
};

export default BlueprintMarketplaceModal;
