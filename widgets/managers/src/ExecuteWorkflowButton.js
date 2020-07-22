/**
 * Created by jakub.niezgoda on 30/10/2018.
 */

export default function ExecuteWorkflowButton({ noManagers, onClick, workflows }) {
    const { Button, Popup } = Stage.Basic;
    const { WorkflowsMenu } = Stage.Common;

    return (
        <Popup on={noManagers ? 'hover' : []} open={noManagers ? undefined : false}>
            <Popup.Trigger>
                <div>
                    <WorkflowsMenu
                        workflows={workflows}
                        dropdownDirection="left"
                        trigger={
                            <Button icon="cogs" content="Execute Workflow" labelPosition="left" disabled={noManagers} />
                        }
                        onClick={workflow => onClick(workflow)}
                    />
                </div>
            </Popup.Trigger>

            <Popup.Content>Tick at least one manager to perform bulk workflow execution</Popup.Content>
        </Popup>
    );
}

ExecuteWorkflowButton.propTypes = {
    onClick: PropTypes.func,
    noManagers: PropTypes.bool.isRequired,
    workflows: PropTypes.arrayOf(PropTypes.object)
};

ExecuteWorkflowButton.defaultProps = {
    onClick: _.noop,
    workflows: []
};
