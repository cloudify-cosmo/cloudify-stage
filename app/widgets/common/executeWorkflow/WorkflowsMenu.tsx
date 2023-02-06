import type { ComponentProps, FunctionComponent, ReactNode } from 'react';
import React, { useState } from 'react';
import { capitalize, chain, filter, lowerCase, map, size, sortBy } from 'lodash';
import type { AccordionTitleProps } from 'semantic-ui-react';
import i18n from 'i18next';
import type { Workflow } from './types';
import { Accordion, Menu, Popup, PopupMenu } from '../../../components/basic';

function filterWorkflows(workflows: Workflow[]) {
    const updateWorkflow = 'update';
    return filter(workflows, workflow => workflow.is_available && workflow.name !== updateWorkflow);
}

interface StyledTitleProps {
    name: string;
    bold?: boolean;
}
const StyledTitle: FunctionComponent<StyledTitleProps> = ({ name, bold = false }) => {
    const displayName = capitalize(lowerCase(name));
    return <span style={bold ? { fontWeight: 'bold' } : {}}>{displayName}</span>;
};

type OnWorkflowClick = (workflow: Workflow) => void;

interface WorkflowsMenuItemsProps {
    workflows: Workflow[];
    onClick: OnWorkflowClick;
}
const WorkflowsMenuItems: FunctionComponent<WorkflowsMenuItemsProps> = ({ workflows, onClick }) => (
    <>
        {map(workflows, workflow => (
            <Menu.Item
                name={workflow.name}
                content={<StyledTitle name={workflow.name} />}
                key={workflow.name}
                onClick={() => onClick(workflow)}
            />
        ))}
    </>
);

interface AccordionWorkflowsMenuProps {
    workflowsGroups: {
        name: string;
        workflows: Workflow[];
    }[];
    onClick: OnWorkflowClick;
}

const defaultGroupName = 'default_workflows';
const AccordionWorkflowsMenu: FunctionComponent<AccordionWorkflowsMenuProps> = ({ workflowsGroups, onClick }) => {
    const [activeGroup, setActiveGroup] = useState('');

    function onGroupClick(event: React.MouseEvent<HTMLDivElement>, pluginItemProps: AccordionTitleProps) {
        event.stopPropagation();

        const index = pluginItemProps.index as string;

        setActiveGroup(activeGroup === index ? '' : index);
    }

    return (
        <Accordion as={Menu} vertical style={{ boxShadow: 'none' }}>
            {map(workflowsGroups, group => (
                <Menu.Item key={group.name} style={{ padding: 0 }}>
                    <Accordion.Title
                        active={activeGroup === group.name}
                        index={group.name}
                        content={<StyledTitle bold={group.name === defaultGroupName} name={group.name} />}
                        onClick={onGroupClick}
                        style={{ padding: '13px 16px' }}
                    />
                    <Accordion.Content active={activeGroup === group.name} style={{ paddingTop: 0, paddingLeft: 16 }}>
                        <Menu.Menu>
                            <WorkflowsMenuItems workflows={group.workflows} onClick={onClick} />
                        </Menu.Menu>
                    </Accordion.Content>
                </Menu.Item>
            ))}
        </Accordion>
    );
};

export interface WorkflowsMenuProps {
    workflows: Workflow[];
    onClick: OnWorkflowClick;
    showInPopup?: boolean;
    trigger?: ReactNode;
}

const WorkflowsMenu: FunctionComponent<WorkflowsMenuProps> = ({
    workflows,
    onClick,
    showInPopup = true,
    trigger = null
}) => {
    const filteredAndSortedWorkflows = sortBy(filterWorkflows(workflows), 'name');
    const workflowsGroups = chain(filteredAndSortedWorkflows)
        .groupBy('plugin')
        .map((value, key) => ({ name: key, workflows: value }))
        .sortBy('name')
        .value();
    const showOnlyDefaultWorkflows = size(workflowsGroups) === 1;
    const popupMenuProps: Partial<ComponentProps<typeof PopupMenu>> = !trigger
        ? {
              icon: 'cogs',
              help: i18n.t('widgets.common.deployments.workflowsMenu.tooltip'),
              offset: [0, 5]
          }
        : {};

    if (showInPopup) {
        return (
            <PopupMenu className="workflowsMenu" {...popupMenuProps}>
                {!!trigger && <Popup.Trigger>{trigger}</Popup.Trigger>}

                {showOnlyDefaultWorkflows ? (
                    <Menu vertical>
                        <WorkflowsMenuItems workflows={filteredAndSortedWorkflows} onClick={onClick} />
                    </Menu>
                ) : (
                    <AccordionWorkflowsMenu workflowsGroups={workflowsGroups} onClick={onClick} />
                )}
            </PopupMenu>
        );
    }

    return showOnlyDefaultWorkflows ? (
        <WorkflowsMenuItems workflows={filteredAndSortedWorkflows} onClick={onClick} />
    ) : (
        <AccordionWorkflowsMenu workflowsGroups={workflowsGroups} onClick={onClick} />
    );
};

export default WorkflowsMenu;
