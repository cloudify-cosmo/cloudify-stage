/**
 * StepActions component is interface for components implementing step actions for {@link WizardModal}
 */
export default class StepActions extends React.Component {
    constructor(props) {
        super(props);
    }

    /**
     * @property {string} id step ID
     * @property {Function} onClose function calling wizard to close
     * @property {Function} onStartOver function calling wizard to start over wizard process
     * @property {Function} onPrev function calling wizard to move to the previous step
     * @property {Function} onNext function calling wizard to move to the next step
     * @property {Function} onError function setting wizard in error state
     * @property {Function} onLoading function setting wizard in loading state
     * @property {Function} onReady function setting wizard in ready state
     * @property {Function} fetchData function providing step data from step content
     * @property {object} wizardData wizard data object
     * @property {object} toolbox Toolbox object
     * @property {boolean} [disabled=false] if set then action buttons will be disabled
     * @property {string} [startOverLabel='Start Over'] label for Start Over button
     * @property {string} [startOverIcon='undo'] icon to be added to Start Over button
     * @property {boolean} [showStartOver=false] if set to true, then Start Over button will be shown
     * @property {boolean} [resetDataOnStartOver=false] if set to true, then wizard data will be reset on Start Over button click
     * @property {string} [prevLabel='Back'] label for Back button
     * @property {string} [prevIcon='arrow left'] icon to be added to Back button
     * @property {boolean} [showPrev=true] if set to true, then Back button will be shown
     * @property {string} [nextLabel='Next'] label for Next button
     * @property {string} [nextIcon='arrow right'] icon to be added to Next button
     * @property {boolean} [showNext=true] if set to true, then Next button will be shown
     */
    static propTypes = {
        id: PropTypes.string.isRequired,
        onClose: PropTypes.func.isRequired,
        onStartOver: PropTypes.func.isRequired,
        onPrev: PropTypes.func.isRequired,
        onNext: PropTypes.func.isRequired,
        onError: PropTypes.func.isRequired,
        onLoading: PropTypes.func.isRequired,
        onReady: PropTypes.func.isRequired,
        fetchData: PropTypes.func.isRequired,
        wizardData: PropTypes.object.isRequired,
        toolbox: PropTypes.object.isRequired,
        disabled: PropTypes.bool,
        startOverLabel: PropTypes.string,
        startOverIcon: PropTypes.string,
        showStartOver: PropTypes.bool,
        resetDataOnStartOver: PropTypes.bool,
        prevLabel: PropTypes.string,
        prevIcon: PropTypes.string,
        showPrev: PropTypes.bool,
        nextLabel: PropTypes.string,
        nextIcon: PropTypes.string,
        showNext: PropTypes.bool
    };

    static defaultProps = {
        disabled: false,

        closeLabel: 'Close',
        closeIcon: 'cancel',
        showClose: true,
        closeFloated: 'left',

        startOverLabel: 'Start Over',
        startOverIcon: 'undo',
        showStartOver: false,
        resetDataOnStartOver: false,

        prevLabel: 'Back',
        prevIcon: 'arrow left',
        showPrev: true,

        nextLabel: 'Next',
        nextIcon: 'arrow right',
        showNext: true
    };

    onClose() {
        return this.props.onClose();
    }

    onStartOver() {
        return this.props.onStartOver(this.props.resetDataOnStartOver);
    }

    onPrev() {
        return this.props.onPrev(this.props.id);
    }

    onNext() {
        return this.props.onNext(this.props.id);
    }

    render() {
        const { Button } = Stage.Basic;

        return (
            <>
                {this.props.children}

                {this.props.showClose && (
                    <Button
                        floated={this.props.closeFloated}
                        icon={this.props.closeIcon}
                        content={this.props.closeLabel}
                        labelPosition="left"
                        onClick={this.onClose.bind(this)}
                    />
                )}
                {this.props.showStartOver && (
                    <Button
                        icon={this.props.startOverIcon}
                        content={this.props.startOverLabel}
                        disabled={this.props.disabled}
                        labelPosition="left"
                        onClick={this.onStartOver.bind(this)}
                    />
                )}

                <Button.Group>
                    {this.props.showPrev && (
                        <Button
                            icon={this.props.prevIcon}
                            content={this.props.prevLabel}
                            disabled={this.props.disabled}
                            labelPosition="left"
                            onClick={this.onPrev.bind(this)}
                        />
                    )}
                    {this.props.showNext && (
                        <Button
                            icon={this.props.nextIcon}
                            content={this.props.nextLabel}
                            disabled={this.props.disabled}
                            labelPosition="right"
                            onClick={this.onNext.bind(this)}
                        />
                    )}
                </Button.Group>
            </>
        );
    }
}
