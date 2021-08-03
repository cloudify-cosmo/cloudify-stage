import { ComponentProps, FunctionComponent } from 'react';

const translate = Stage.Utils.getT('widgets.common.blueprintUploadActionsMenu');
const menuItems: ComponentProps<typeof Stage.Basic.Menu.Item>[] = [
    { name: 'uploadFromMarketplace', key: 'uploadFromMarketplace', content: translate('uploadFromMarketplace') },
    { name: 'uploadFromPackage', key: 'uploadFromPackage', content: translate('uploadFromPackage') },
    { name: 'generateInComposer', key: 'generateInComposer', content: translate('generateInComposer') }
];

type ModalName = typeof menuItems[number]['name'];

interface UploadActionsMenuProps {
    toolbox: Stage.Types.Toolbox;
}

const UploadActionsMenu: FunctionComponent<UploadActionsMenuProps> = ({ children, toolbox }) => {
    const {
        Basic: { Menu, Popup, PopupMenu }
    } = Stage;
    const [openedModalName, setOpenedModalName] = React.useState<ModalName | ''>('');
    const handleMenuClick: ComponentProps<typeof Menu>['onItemClick'] = React.useCallback(
        (_, { name }) => {
            setOpenedModalName(name);
        },
        [setOpenedModalName]
    );
    const hideModal = React.useCallback(() => {
        setOpenedModalName('');
    }, [setOpenedModalName]);
    const getModal = React.useCallback(
        (name: ModalName) => {
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
            <PopupMenu className="deploymentActionsMenu">
                <Popup.Trigger>{children}</Popup.Trigger>
                <Menu pointing vertical onItemClick={handleMenuClick} items={menuItems} />
            </PopupMenu>
            {getModal(openedModalName)}
        </>
    );
};

export default UploadActionsMenu;

declare global {
    namespace Stage.Common {
        // eslint-disable-next-line import/prefer-default-export
        export { UploadActionsMenu };
    }
}

Stage.defineCommon({
    name: 'UploadActionsMenu',
    common: React.memo(UploadActionsMenu, _.isEqual)
});
