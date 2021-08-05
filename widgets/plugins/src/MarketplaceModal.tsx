const t = Stage.Utils.getT('widgets.plugins');

const modalContentLayout: { type: 'widgets'; content: any } = {
    type: 'widgets',
    content: [
        {
            id: 'pluginsCatalog',
            name: t('upload.catalog'),
            width: 12,
            height: 24,
            definition: 'pluginsCatalog',
            configuration: { jsonPath: Stage.i18n.t('urls.pluginsCatalog') }
        }
    ]
};

const { CancelButton, Icon, Modal } = Stage.Basic;

export default function MarketplaceModal({ open, onHide }: { open: boolean; onHide: () => void }) {
    const { PageContent } = Stage.Shared.Widgets;

    return (
        <Modal open={open} onClose={onHide}>
            <Modal.Header>
                <Icon name="upload" /> {t(`upload.marketplace`)}
            </Modal.Header>
            <Modal.Content>
                <PageContent
                    page={{ layout: [modalContentLayout] }}
                    onWidgetUpdated={_.noop}
                    onWidgetRemoved={_.noop}
                    onWidgetAdded={_.noop}
                    onTabAdded={_.noop}
                    onTabRemoved={_.noop}
                    onTabUpdated={_.noop}
                    onTabMoved={_.noop}
                    onLayoutSectionAdded={_.noop}
                    onLayoutSectionRemoved={_.noop}
                    isEditMode={false}
                />
            </Modal.Content>
            <Modal.Actions>
                <CancelButton onClick={onHide} content={t(`upload.close`)} />
            </Modal.Actions>
        </Modal>
    );
}
