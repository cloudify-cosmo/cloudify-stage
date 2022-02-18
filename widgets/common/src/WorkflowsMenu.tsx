// @ts-nocheck File not migrated fully to TS
export {};

const WorkflowsPropType = Stage.PropTypes.Workflows;

function filterWorkflows(workflows) {
    const updateWorkflow = 'update';
    return _.filter(workflows, workflow => workflow.name !== updateWorkflow);
}

function StyledTitle({ name, bold }) {
    const displayName = _.capitalize(_.lowerCase(name));
    return <span style={bold ? { fontWeight: 'bold' } : {}}>{displayName}</span>;
}

StyledTitle.propTypes = {
    name: PropTypes.string.isRequired,
    bold: PropTypes.bool
};

StyledTitle.defaultProps = {
    bold: false
};

function WorkflowsMenuItems({ onClick, workflows }) {
    const { Menu } = Stage.Basic;

    return _.map(workflows, workflow => (
        <Menu.Item
            name={workflow.name}
            content={<StyledTitle name={workflow.name} />}
            key={workflow.name}
            onClick={() => onClick(workflow)}
        />
    ));
}

WorkflowsMenuItems.propTypes = {
    workflows: WorkflowsPropType.isRequired,
    onClick: PropTypes.func
};

WorkflowsMenuItems.defaultProps = {
    onClick: _.noop
};

class AccordionWorkflowsMenu extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            activeGroup: ''
        };
    }

    onGroupClick = (event, pluginItemProps) => {
        event.stopPropagation();

        const { index } = pluginItemProps;
        const { activeGroup } = this.state;

        this.setState({ activeGroup: activeGroup === index ? '' : index });
    };

    render() {
        const { Accordion, Menu } = Stage.Basic;

        const { workflowsGroups, onClick } = this.props;
        const { activeGroup } = this.state;

        const defaultGroupName = 'default_workflows';

        return (
            <Accordion as={Menu} vertical style={{ boxShadow: 'none' }}>
                {_.map(workflowsGroups, group => (
                    <Menu.Item key={group.name} style={{ padding: 0 }}>
                        <Accordion.Title
                            active={activeGroup === group.name}
                            index={group.name}
                            content={<StyledTitle bold={group.name === defaultGroupName} name={group.name} />}
                            onClick={this.onGroupClick}
                            style={{ padding: '13px 16px' }}
                        />
                        <Accordion.Content
                            active={activeGroup === group.name}
                            style={{ paddingTop: 0, paddingLeft: 16 }}
                        >
                            <Menu.Menu>
                                <WorkflowsMenuItems workflows={group.workflows} onClick={onClick} />
                            </Menu.Menu>
                        </Accordion.Content>
                    </Menu.Item>
                ))}
            </Accordion>
        );
    }
}

AccordionWorkflowsMenu.propTypes = {
    workflowsGroups: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string,
            workflows: WorkflowsPropType
        })
    ).isRequired,
    onClick: PropTypes.func
};

AccordionWorkflowsMenu.defaultProps = {
    onClick: _.noop
};

function WorkflowsMenu({ workflows, onClick, showInPopup, trigger }) {
    const {
        Basic: { Menu, Popup, PopupMenu },
        i18n
    } = Stage;

    const filteredAndSortedWorkflows = _.sortBy(filterWorkflows(workflows), 'name');
    const workflowsGroups = _.chain(filteredAndSortedWorkflows)
        .groupBy('plugin')
        .map((value, key) => ({ name: key, workflows: value }))
        .sortBy('name')
        .value();
    const showOnlyDefaultWorkflows = _.size(workflowsGroups) === 1;
    const popupMenuProps = !trigger
        ? {
              bordered: true,
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
}

WorkflowsMenu.propTypes = {
    workflows: WorkflowsPropType.isRequired,
    onClick: PropTypes.func,
    showInPopup: PropTypes.bool,
    trigger: PropTypes.element
};

WorkflowsMenu.defaultProps = {
    onClick: _.noop,
    showInPopup: true,
    trigger: null
};

Stage.defineCommon({
    name: 'WorkflowsMenu',
    common: WorkflowsMenu
});
