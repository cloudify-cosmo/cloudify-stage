/**
 * Created by jakubniezgoda on 31/01/2019.
 */

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
    workflows: PropTypes.arrayOf(PropTypes.shape({ name: PropTypes.string })).isRequired,
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
                    <Menu.Item key={group.name}>
                        <Accordion.Title
                            active={activeGroup === group.name}
                            index={group.name}
                            content={<StyledTitle bold={group.name === defaultGroupName} name={group.name} />}
                            onClick={this.onGroupClick}
                        />
                        <Accordion.Content active={activeGroup === group.name}>
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
            workflows: PropTypes.array
        })
    ).isRequired,
    onClick: PropTypes.func
};

AccordionWorkflowsMenu.defaultProps = {
    onClick: _.noop
};

function WorkflowsMenu({ workflows, onClick, popupMenuProps, showInPopup, trigger }) {
    const { Menu, Popup, PopupMenu } = Stage.Basic;

    const workflowsGroups = _.chain(workflows)
        .groupBy('plugin')
        .map((value, key) => ({ name: key, workflows: value }))
        .sortBy('name')
        .value();
    const showOnlyDefaultWorkflows = _.size(workflowsGroups) === 1;

    if (showInPopup) {
        return (
            <PopupMenu
                className="workflowAction"
                position="bottom center"
                offset={0}
                icon={popupMenuProps.icon}
                help={popupMenuProps.help}
                bordered={popupMenuProps.bordered}
            >
                {!!trigger && <Popup.Trigger>{trigger}</Popup.Trigger>}

                {showOnlyDefaultWorkflows ? (
                    <Menu vertical>
                        <WorkflowsMenuItems workflows={workflows} onClick={onClick} />
                    </Menu>
                ) : (
                    <AccordionWorkflowsMenu workflowsGroups={workflowsGroups} onClick={onClick} />
                )}
            </PopupMenu>
        );
    }

    return showOnlyDefaultWorkflows ? (
        <WorkflowsMenuItems workflows={workflows} onClick={onClick} />
    ) : (
        <AccordionWorkflowsMenu workflowsGroups={workflowsGroups} onClick={onClick} />
    );
}

WorkflowsMenu.propTypes = {
    workflows: PropTypes.arrayOf(PropTypes.shape({ plugin: PropTypes.string })).isRequired,
    onClick: PropTypes.func,
    popupMenuProps: PropTypes.shape({ icon: PropTypes.string, help: PropTypes.string, bordered: PropTypes.bool }),
    showInPopup: PropTypes.bool,
    trigger: PropTypes.element
};

WorkflowsMenu.defaultProps = {
    onClick: _.noop,
    showInPopup: true,
    popupMenuProps: {},
    trigger: null
};

Stage.defineCommon({
    name: 'WorkflowsMenu',
    common: WorkflowsMenu
});
