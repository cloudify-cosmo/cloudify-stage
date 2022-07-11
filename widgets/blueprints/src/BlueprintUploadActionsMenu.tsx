import { useMemo } from 'react';
import type { FunctionComponent } from 'react';
import { map } from 'lodash';

const { Dropdown } = Stage.Basic;
const { Menu, Item } = Dropdown;
const { useBoolean } = Stage.Hooks;
const { TerraformModal } = Stage.Common;
const { drilldownPage } = Stage.Common.Consts;
const { UploadModal: UploadBlueprintModal } = Stage.Common.Blueprints;

const t = Stage.Utils.getT('widgets.common.blueprintUpload.actionsMenu');
const defaultMarketplaceTab = 'AWS';

interface BlueprintUploadActionsMenuProps {
    direction?: 'left' | 'right';
    upward?: boolean;
    toolbox: Stage.Types.Toolbox;
    showGenerateInComposerButton?: boolean;
}

const BlueprintUploadActionsMenu: FunctionComponent<BlueprintUploadActionsMenuProps> = ({
    direction,
    upward,
    toolbox,
    showGenerateInComposerButton = false
}) => {
    const [uploadModalVisible, showUploadModal, hideUploadModal] = useBoolean();
    const [terraformModalVisible, showTerraformModal, hideTerraformModal] = useBoolean();

    const redirectToMarketplacePage = () => {
        const widget = toolbox.getWidget();
        toolbox.drillDown(widget, drilldownPage.blueprintMarketplace, {
            defaultTab: defaultMarketplaceTab
        });
    };

    const menuItems = useMemo(() => {
        const baseMenuItems = {
            uploadFromMarketplace: redirectToMarketplacePage,
            uploadFromPackage: showUploadModal,
            uploadFromTerraformTemplate: showTerraformModal
        };

        if (showGenerateInComposerButton) {
            return { ...baseMenuItems, generateInComposer: Stage.Utils.openComposer };
        }

        return baseMenuItems;
    }, [showGenerateInComposerButton]);

    return (
        <>
            <Dropdown button text={t('uploadButton')} direction={direction} upward={upward}>
                {/* Display the menu above all leaflet components, see https://leafletjs.com/reference-1.7.1.html#map-pane */}
                <Menu>
                    {map(menuItems, (clickHandler, key) => (
                        <Item text={t(key)} key={key} onClick={clickHandler} />
                    ))}
                </Menu>
            </Dropdown>
            {uploadModalVisible && <UploadBlueprintModal open onHide={hideUploadModal} toolbox={toolbox} />}
            {terraformModalVisible && <TerraformModal onHide={hideTerraformModal} toolbox={toolbox} />}
        </>
    );
};

export default React.memo(BlueprintUploadActionsMenu, _.isEqual);
