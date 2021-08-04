import type { FunctionComponent } from 'react';
import uuid from 'uuid';

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
    layout: [
        {
            type: 'tabs',
            content: tabs.map(tab => ({
                name: tab.name,
                widgets: [
                    {
                        id: uuid.v4(),
                        name: 'Blueprints Catalog',
                        x: 0,
                        y: 0,
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
    const { getT } = Stage.Utils;
    const t = getT('widgets.common.blueprintMarketplace');

    const { CancelButton, Icon, Modal } = Stage.Basic;
    const { PageContent } = Stage.Shared.Widgets;

    return (
        <Modal open={open} onClose={onHide}>
            <Modal.Header>
                <Icon name="upload" /> {t(`modal.header`)}
            </Modal.Header>
            <Modal.Content>
                <PageContent page={getPageLayout(tabs) as any} />
            </Modal.Content>
            <Modal.Actions>
                <CancelButton onClick={onHide} disabled={false} content="Close" />
            </Modal.Actions>
        </Modal>
    );
};

BlueprintMarketplaceModal.propTypes = {
    open: PropTypes.bool.isRequired,
    onHide: PropTypes.func.isRequired
};

export default BlueprintMarketplaceModal;

declare global {
    namespace Stage.Common {
        // eslint-disable-next-line import/prefer-default-export
        export { BlueprintMarketplaceModal };
    }
}

Stage.defineCommon({
    name: 'BlueprintMarketplaceModal',
    common: React.memo(BlueprintMarketplaceModal, _.isEqual)
});
