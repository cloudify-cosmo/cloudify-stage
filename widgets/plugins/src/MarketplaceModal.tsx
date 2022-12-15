import type { TemplatePageDefinition } from '../../../app/actions/templateManagement/pages';

const t = Stage.Utils.getT('widgets.plugins');

const pluginsMarketplacePage: TemplatePageDefinition = {
    name: '',
    layout: [
        {
            type: 'widgets',
            content: [
                {
                    id: 'pluginsCatalog',
                    name: t('upload.catalog'),
                    height: 24,
                    width: 12,
                    definition: 'pluginsCatalog',
                    configuration: { jsonPath: Stage.i18n.t('urls.pluginsCatalog') },
                    x: 0,
                    y: 0,
                    maximized: true,
                    drillDownPages: {}
                }
            ]
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
                <PageContent page={pluginsMarketplacePage} />
            </Modal.Content>
            <Modal.Actions>
                <CancelButton onClick={onHide} content={t(`upload.close`)} />
            </Modal.Actions>
        </Modal>
    );
}
