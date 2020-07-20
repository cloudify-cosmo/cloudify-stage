/**
 * Created by jakubniezgoda on 31/01/2019.
 */

class WorkflowsMenuItems extends React.Component {
    static propTypes = {
        workflows: PropTypes.arrayOf(PropTypes.shape({ name: PropTypes.string })).isRequired,
        onClick: PropTypes.func
    };

    static defaultProps = {
        onClick: _.noop
    };

    render() {
        const { Menu } = Stage.Basic;
        const { onClick, workflows } = this.props;

        return _.map(workflows, workflow => (
            <Menu.Item
                name={workflow.name}
                content={_.capitalize(_.lowerCase(workflow.name))}
                key={workflow.name}
                onClick={() => onClick(workflow)}
            />
        ));
    }
}

class AccordionWorkflowsMenu extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            activeGroup: ''
        };
    }

    static propTypes = {
        workflowsGroups: PropTypes.arrayOf(
            PropTypes.shape({
                name: PropTypes.string,
                workflows: PropTypes.array
            })
        ).isRequired,
        onClick: PropTypes.func
    };

    static defaultProps = {
        onClick: _.noop
    };

    onGroupClick(event, pluginItemProps) {
        event.stopPropagation();

        const { index } = pluginItemProps;
        const { activeGroup } = this.state;

        this.setState({ activeGroup: activeGroup === index ? '' : index });
    }

    render() {
        const { Accordion, Menu } = Stage.Basic;

        const { workflowsGroups, onClick } = this.props;
        const { activeGroup } = this.state;

        return (
            <Accordion as={Menu} vertical style={{ boxShadow: 'none' }}>
                {_.map(workflowsGroups, group => (
                    <Menu.Item key={group.name}>
                        <Accordion.Title
                            active={activeGroup === group.name}
                            index={group.name}
                            content={_.capitalize(_.lowerCase(group.name))}
                            onClick={this.onGroupClick.bind(this)}
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

class WorkflowsMenu extends React.Component {
    static propTypes = {
        workflows: PropTypes.arrayOf(PropTypes.shape({ plugin: PropTypes.string })).isRequired,
        onClick: PropTypes.func,
        popupMenuProps: PropTypes.shape({}),
        showInPopup: PropTypes.bool,
        trigger: PropTypes.element
    };

    static defaultProps = {
        onClick: _.noop,
        showInPopup: true,
        popupMenuProps: {},
        trigger: null
    };

    render() {
        const { Menu, Popup, PopupMenu } = Stage.Basic;

        const { workflows, onClick, popupMenuProps, showInPopup, trigger } = this.props;
        const workflowsGroups = _.chain(workflows)
            .groupBy('plugin')
            .map((value, key) => ({ name: key, workflows: value }))
            .sortBy('name')
            .value();
        const showOnlyDefaultWorkflows = _.size(workflowsGroups) === 1;

        return showInPopup ? (
            <PopupMenu className="workflowAction" position="bottom center" offset={0} {...popupMenuProps}>
                {!!trigger && <Popup.Trigger>{trigger}</Popup.Trigger>}

                {showOnlyDefaultWorkflows ? (
                    <Menu vertical>
                        <WorkflowsMenuItems workflows={workflows} onClick={onClick} />
                    </Menu>
                ) : (
                    <AccordionWorkflowsMenu workflowsGroups={workflowsGroups} onClick={onClick} />
                )}
            </PopupMenu>
        ) : showOnlyDefaultWorkflows ? (
            <WorkflowsMenuItems workflows={workflows} onClick={onClick} />
        ) : (
            <AccordionWorkflowsMenu workflowsGroups={workflowsGroups} onClick={onClick} />
        );
    }
}

Stage.defineCommon({
    name: 'WorkflowsMenu',
    common: WorkflowsMenu
});
