/**
 * Created by jakubniezgoda on 31/01/2019.
 */

import PropTypes from 'prop-types';

class WorkflowsMenuItems extends React.Component {

    static propTypes = {
        workflows: PropTypes.array.isRequired,
        onClick: PropTypes.func
    };

    static defaultProps = {
        onClick: _.noop
    };

    render() {
        let { Menu } = Stage.Basic;
        const { onClick, workflows } = this.props;

        return _.map(workflows, (workflow) =>
            <Menu.Item content={_.capitalize(_.lowerCase(workflow.name))} key={workflow.name}
                       onClick={() => onClick(workflow)} />
        )
    }
}

class AccordionWorkflowsMenu extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            activeGroup: ''
        }
    }

    static propTypes = {
        workflowsGroups: PropTypes.arrayOf(
            PropTypes.shape({
                name: PropTypes.string,
                workflows: PropTypes.array
            })).isRequired,
        onClick: PropTypes.func
    };

    static defaultProps = {
        onClick: _.noop
    };

    onGroupClick(event, pluginItemProps) {
        event.stopPropagation();

        const { index } = pluginItemProps;
        const { activeGroup } = this.state;

        this.setState({ activeGroup: activeGroup === index ? '' : index })
    }

    render() {
        let { Accordion, Menu } = Stage.Basic;

        const { workflowsGroups, onClick } = this.props;
        const { activeGroup } = this.state;

        return (
            <Accordion as={Menu} vertical style={{boxShadow: 'none'}}>
                {
                    _.map(workflowsGroups, (group) =>
                        <Menu.Item key={group.name}>
                            <Accordion.Title active={activeGroup === group.name} index={group.name}
                                             content={_.capitalize(_.lowerCase(group.name))}
                                             onClick={this.onGroupClick.bind(this)} />
                            <Accordion.Content active={activeGroup === group.name}>
                                <Menu.Menu>
                                    <WorkflowsMenuItems workflows={group.workflows}
                                                        onClick={onClick} />
                                </Menu.Menu>
                            </Accordion.Content>
                        </Menu.Item>
                    )
                }
            </Accordion>
        )
    }
}

class WorkflowsMenu extends React.Component {

    static propTypes = {
        workflows: PropTypes.array.isRequired,
        onClick: PropTypes.func,
        popupMenuProps: PropTypes.object,
        showInPopup: PropTypes.bool,
        trigger: PropTypes.element
    };

    static defaultProps = {
        onClick: _.noop,
        showInPopup: true,
        popupMenuProps: {},
        trigger: null
    };

    render () {
        let {Menu, Popup, PopupMenu} = Stage.Basic;

        const workflows = this.props.workflows;
        const workflowsGroups = _.chain(workflows)
            .groupBy('plugin')
            .map((value, key) => ({name: key, workflows: value}))
            .sortBy('group')
            .value();
        const showOnlyDefaultWorkflows = _.size(workflowsGroups) === 1;

        return (
            this.props.showInPopup
            ?
                <PopupMenu className="workflowAction" position="bottom center"
                           offset={0} {...this.props.popupMenuProps}>
                    {
                        !!this.props.trigger &&
                        <Popup.Trigger>
                            {this.props.trigger}
                        </Popup.Trigger>
                    }

                    {
                        showOnlyDefaultWorkflows
                        ?
                            <Menu vertical>
                                <WorkflowsMenuItems workflows={workflows} onClick={this.props.onClick} />
                            </Menu>
                        :
                            <AccordionWorkflowsMenu workflowsGroups={workflowsGroups} onClick={this.props.onClick} />
                    }
                </PopupMenu>
            :
                showOnlyDefaultWorkflows
                ?
                    <WorkflowsMenuItems workflows={workflows} onClick={this.props.onClick} />
                :
                    <AccordionWorkflowsMenu workflowsGroups={workflowsGroups} onClick={this.props.onClick} />
        );
    }
}

Stage.defineCommon({
    name: 'WorkflowsMenu',
    common: WorkflowsMenu
});