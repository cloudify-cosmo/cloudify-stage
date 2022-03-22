import { useMemo } from 'react';
import type { FunctionComponent } from 'react';
import { map } from 'lodash';
import type { MarketplaceTab } from '../../common/src/blueprintMarketplace/types';

const t = Stage.Utils.getT('widgets.common.blueprintUpload.actionsMenu');

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
        Basic: { Dropdown },
        Common: { UploadBlueprintModal, BlueprintMarketplace, TerraformModal },
        Hooks: { useBoolean }
    } = Stage;
    const { Menu, Item } = Dropdown;

    const [marketplaceModalVisible, showMarketplaceModal, hideMarketplaceModal] = useBoolean();
    const [uploadModalVisible, showUploadModal, hideUploadModal] = useBoolean();
    const [terraformModalVisible, showTerraformModal, hideTerraformModal] = useBoolean();

    const menuItems = useMemo(() => {
        const baseMenuItems = {
            uploadFromMarketplace: showMarketplaceModal,
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
            <Dropdown button text={t('uploadButton')} direction={direction}>
                {/* Display the menu above all leaflet components, see https://leafletjs.com/reference-1.7.1.html#map-pane */}
                <Menu>
                    {map(menuItems, (clickHandler, key) => (
                        <Item text={t(key)} key={key} onClick={clickHandler} />
                    ))}
                </Menu>
            </Dropdown>
            {marketplaceModalVisible && (
                <BlueprintMarketplace.Modal
                    open
                    onHide={hideMarketplaceModal}
                    tabs={marketplaceConfig.tabs}
                    displayStyle={marketplaceConfig.displayStyle}
                    columns={marketplaceConfig.columns}
                />
            )}
            {uploadModalVisible && <UploadBlueprintModal open onHide={hideUploadModal} toolbox={toolbox} />}
            {terraformModalVisible && <TerraformModal onHide={hideTerraformModal} toolbox={toolbox} />}
        </>
    );
};

export default React.memo(BlueprintUploadActionsMenu, _.isEqual);
