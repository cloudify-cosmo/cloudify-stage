import type { ComponentProps, ReactNode } from 'react';
import React from 'react';
import type { PopupMenuProps } from 'cloudify-ui-components';
import type { Workflow } from '../executeWorkflow';
import { Menu, Popup, PopupMenu } from '../../../components/basic';
import StageUtils from '../../../utils/stageUtils';
import type { Label } from '../labels/types';
import { menuItems } from './DeploymentActionsMenu.consts';
import { isMenuItemAvailable } from './DeploymentActionsMenu.utils';
import useSitesExist from './useSitesExist';

const translate = StageUtils.getT('widgets.common.deployments.actionsMenu');

interface DeploymentActionsMenuProps {
    onActionClick: (actionName: string) => void;
    toolbox: Stage.Types.Toolbox;
    trigger?: ReactNode;
    workflows: Workflow[];
    deploymentLabels: Label[];
}

export default function DeploymentActionsMenu({
    onActionClick,
    toolbox,
    trigger,
    workflows,
    deploymentLabels
}: DeploymentActionsMenuProps) {
    const [sitesExist] = useSitesExist(toolbox);
    const managerState = toolbox.getManagerState();
    const items = menuItems.map(item => ({
        ...item,
        key: item.name,
        content: translate(item.name),
        disabled:
            !StageUtils.isUserAuthorized(item.permission, managerState) ||
            !isMenuItemAvailable(item, workflows, deploymentLabels, sitesExist)
    }));
    const popupMenuProps: Partial<PopupMenuProps> = !trigger ? { help: translate('tooltip'), offset: [0, 5] } : {};

    const onItemClick: ComponentProps<typeof Menu>['onItemClick'] = (_event, { name }) => {
        onActionClick(name!);
    };

    return (
        <PopupMenu className="deploymentActionsMenu" {...popupMenuProps}>
            {trigger && <Popup.Trigger>{trigger}</Popup.Trigger>}
            <Menu pointing vertical onItemClick={onItemClick} items={items} />
        </PopupMenu>
    );
}
