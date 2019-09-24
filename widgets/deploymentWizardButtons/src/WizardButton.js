/**
 * Created by jakub.niezgoda on 13/08/2018.
 */

export default class WizardButton extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            open: false
        };
    }

    static propTypes = {
        color: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        icon: PropTypes.string.isRequired,
        wizardTitle: PropTypes.string.isRequired,
        steps: Stage.Basic.Wizard.Modal.propTypes.steps,
        toolbox: PropTypes.object.isRequired
    };

    openWizard(event) {
        event.stopPropagation();
        this.setState({ open: true });
    }

    closeWizard() {
        this.setState({ open: false });
    }

    render() {
        const { Button, Icon, Wizard } = Stage.Basic;
        const { color, icon, name, steps, toolbox, wizardTitle } = this.props;

        return (
            <>
                <Button
                    color={color}
                    onClick={this.openWizard.bind(this)}
                    labelPosition="left"
                    icon
                    className="widgetButton"
                >
                    <Icon name={icon} size="large" />
                    {name}
                </Button>
                <Wizard.Modal
                    header={wizardTitle}
                    open={this.state.open}
                    steps={steps}
                    onClose={this.closeWizard.bind(this)}
                    toolbox={toolbox}
                />
            </>
        );
    }
}
