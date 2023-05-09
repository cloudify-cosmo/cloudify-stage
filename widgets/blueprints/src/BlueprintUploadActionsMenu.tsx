import type { FunctionComponent } from 'react';
import { useMemo } from 'react';
import { isEqual, map } from 'lodash';

const { Dropdown } = Stage.Basic;
const { Menu, Item } = Dropdown;
const { useBoolean } = Stage.Hooks;
// const { TerraformModal } = Stage.Common;
const { drilldownPage } = Stage.Common.Consts;
const { UploadModal: UploadBlueprintModal } = Stage.Common.Blueprints;

const translate = Stage.Utils.getT('widgets.common.blueprintUpload.actionsMenu');
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
    // const [terraformModalVisible, _showTerraformModal, hideTerraformModal] = useBoolean();

    const redirectToMarketplacePage = () => {
        const widget = toolbox.getWidget();
        toolbox.drillDown(widget, drilldownPage.blueprintMarketplace, {
            defaultTab: defaultMarketplaceTab
        });
    };

    const menuItems = useMemo(() => {
        const baseMenuItems = {
            uploadFromMarketplace: redirectToMarketplacePage,
            uploadFromPackage: showUploadModal
            // TODO: RND-292 - remove as part of dedicated ticket once confirmed
            // uploadFromTerraformTemplate: showTerraformModal
        };

        if (showGenerateInComposerButton) {
            return { ...baseMenuItems, generateInComposer: Stage.Utils.openComposer };
        }

        return baseMenuItems;
    }, [showGenerateInComposerButton]);

    return (
        <>
            <Dropdown button text={translate('uploadButton')} direction={direction} upward={upward}>
                {/* Display the menu above all leaflet components, see https://leafletjs.com/reference-1.7.1.html#map-pane */}
                <Menu>
                    {map(menuItems, (clickHandler, key) => (
                        <Item text={translate(key)} key={key} onClick={clickHandler} />
                    ))}
                </Menu>
            </Dropdown>
            {uploadModalVisible && <UploadBlueprintModal open onHide={hideUploadModal} toolbox={toolbox} />}
            {/* {terraformModalVisible && <TerraformModal onHide={hideTerraformModal} toolbox={toolbox} />} */}
        </>
    );
};

export default React.memo(BlueprintUploadActionsMenu, isEqual);
