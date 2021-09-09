import { ComponentProps, FunctionComponent } from 'react';
import type { MarketplaceTab } from './blueprintMarketplace/types';

const t = Stage.Utils.getT('widgets.common.blueprintUpload.actionsMenu');
const baseMenuItems: ComponentProps<typeof Stage.Basic.Menu.Item>[] = [
    { name: 'uploadFromMarketplace', key: 'uploadFromMarketplace', content: t('uploadFromMarketplace') },
    { name: 'uploadFromPackage', key: 'uploadFromPackage', content: t('uploadFromPackage') }
];
const generateInComposerMenuItem = {
    name: 'generateInComposer',
    key: 'generateInComposer',
    content: t('generateInComposer')
};

const getMenuItems = (includeComposerButton: boolean) => {
    if (includeComposerButton) {
        return [...baseMenuItems, generateInComposerMenuItem];
    }

    return baseMenuItems;
};

type ActionName = typeof baseMenuItems[number]['name'] | typeof generateInComposerMenuItem['name'];

interface MarketplaceModalConfig {
    tabs?: MarketplaceTab[];
    displayStyle: 'table' | 'catalog';
    columns: string[];
}

interface BlueprintUploadActionsMenuProps {
    direction?: 'left' | 'right';
    toolbox: Stage.Types.Toolbox;
    marketplaceConfig: MarketplaceModalConfig;
    showGenerateInComposerButton?: boolean;
}

const BlueprintUploadActionsMenu: FunctionComponent<BlueprintUploadActionsMenuProps> = ({
    direction,
    toolbox,
    marketplaceConfig,
    showGenerateInComposerButton = false
}) => {
    const {
        Basic: { Dropdown }
    } = Stage;
    const { Menu, Item } = Dropdown;

    const [activeAction, setActiveAction] = React.useState<ActionName | ''>('');
    const handleMenuClick = React.useCallback(
        (name: ActionName) => {
            setActiveAction(name);
        },
        [setActiveAction]
    );
    const hideModal = React.useCallback(() => {
        setActiveAction('');
    }, [setActiveAction]);
    const getModal = React.useCallback(
        (name: ActionName) => {
            // @ts-expect-error UploadBlueprintModal is not converted to TS yet
            const { UploadBlueprintModal, BlueprintMarketplace } = Stage.Common;

            switch (name) {
                case 'uploadFromMarketplace':
                    return (
                        <BlueprintMarketplace.Modal
                            open
                            onHide={hideModal}
                            tabs={marketplaceConfig.tabs}
                            displayStyle={marketplaceConfig.displayStyle}
                            columns={marketplaceConfig.columns}
                        />
                    );
                case 'uploadFromPackage':
                    return <UploadBlueprintModal open onHide={hideModal} toolbox={toolbox} />;
                case 'generateInComposer':
                    Stage.Utils.openComposer();
                    hideModal();
                    return null;
                default:
                    return null;
            }
        },
        [toolbox, hideModal]
    );

    return (
        <>
            <Dropdown button text={t('uploadButton')} direction={direction}>
                {/* Display the menu above all leaflet components, see https://leafletjs.com/reference-1.7.1.html#map-pane */}
                <Menu>
                    {getMenuItems(showGenerateInComposerButton).map(item => (
                        <Item text={item.content} key={item.key} onClick={() => handleMenuClick(item.name)} />
                    ))}
                </Menu>
            </Dropdown>
            {getModal(activeAction)}
        </>
    );
};

export default BlueprintUploadActionsMenu;

declare global {
    namespace Stage.Common {
        // eslint-disable-next-line import/prefer-default-export
        export { BlueprintUploadActionsMenu };
    }
}

Stage.defineCommon({
    name: 'BlueprintUploadActionsMenu',
    common: React.memo(BlueprintUploadActionsMenu, _.isEqual)
});
