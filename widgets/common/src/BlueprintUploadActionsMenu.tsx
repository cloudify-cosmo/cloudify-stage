import { ComponentProps, FunctionComponent } from 'react';

const t = Stage.Utils.getT('widgets.common.blueprintUpload.actionsMenu');
const menuItems: ComponentProps<typeof Stage.Basic.Menu.Item>[] = [
    { name: 'uploadFromMarketplace', key: 'uploadFromMarketplace', content: t('uploadFromMarketplace') },
    { name: 'uploadFromPackage', key: 'uploadFromPackage', content: t('uploadFromPackage') },
    { name: 'generateInComposer', key: 'generateInComposer', content: t('generateInComposer') }
];

type ActionName = typeof menuItems[number]['name'];

interface BlueprintUploadActionsMenuProps {
    direction?: 'left' | 'right';
    toolbox: Stage.Types.Toolbox;
}

const BlueprintUploadActionsMenu: FunctionComponent<BlueprintUploadActionsMenuProps> = ({ direction, toolbox }) => {
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
            const { UploadBlueprintModal } = Stage.Common;

            switch (name) {
                case 'uploadFromMarketplace':
                    // TODO RD-2476
                    return null;
                case 'uploadFromPackage':
                    return <UploadBlueprintModal open onHide={hideModal} toolbox={toolbox} />;
                case 'generateInComposer':
                    window.open(`/composer/`, '_blank');
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
                    {menuItems.map(item => (
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
