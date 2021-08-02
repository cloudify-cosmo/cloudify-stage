import type { FunctionComponent } from 'react';

import { noop } from 'lodash';

const i18nPrefix = 'widgets.common.blueprintMarketPlace';

interface Tab {
    name: string;
    url: string;
}

interface BlueprintMarketplaceModalProps {
    open: boolean;
    tabs: Tab[];
    onHide: () => void;
}

const getPageLayout = (value: Tab[]) => ({
    name: 'details-pane-widgets',
    layout: [
        {
            type: 'tabs',
            content: value.map((tab, index) => ({
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
    const { i18n } = Stage;

    const { CancelButton, Icon, Modal } = Stage.Basic;
    const { PageContent } = Stage.Shared.Widgets;

    return (
        <div>
            <Modal open={open} onClose={onHide} className="uploadBlueprintModal">
                <Modal.Header>
                    <Icon name="upload" /> {i18n.t(`${i18nPrefix}.modal.header`)}
                </Modal.Header>
                <Modal.Content>
                    <PageContent
                        page={getPageLayout(tabs) as any}
                        isEditMode={false}
                        // NOTE: No need to handle the events below since edit mode is always off
                        onWidgetRemoved={noop}
                        onTabAdded={noop}
                        onTabRemoved={noop}
                        onTabUpdated={noop}
                        onTabMoved={noop}
                        onWidgetAdded={noop}
                        onLayoutSectionAdded={noop}
                        onLayoutSectionRemoved={noop}
                    />
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
