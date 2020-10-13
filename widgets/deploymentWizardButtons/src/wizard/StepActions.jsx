/**
 * StepActions component is interface for components implementing step actions for {@link WizardModal}
 */
export default class StepActions extends React.Component {
    onClose = () => {
        const { onClose } = this.props;
        return onClose();
    };

    onStartOver = () => {
        const { onStartOver, resetDataOnStartOver } = this.props;
        return onStartOver(resetDataOnStartOver);
    };

    onPrev = () => {
        const { id, onPrev } = this.props;
        return onPrev(id);
    };

    onNext = () => {
        const { id, onNext } = this.props;
        return onNext(id);
    };

    render() {
        const {
            children,
            closeOnRight,
            disabled,
            nextIcon,
            nextLabel,
            prevIcon,
            prevLabel,
            showClose,
            showNext,
            showPrev,
            showStartOver,
            startOverIcon,
            startOverLabel
        } = this.props;
        const { Button } = Stage.Basic;

        return (
            <>
                {children}

                {showClose && (
                    <Button
                        floated={closeOnRight ? null : 'left'}
                        icon="cancel"
                        content="Close"
                        labelPosition="left"
                        onClick={this.onClose}
                    />
                )}
                {showStartOver && (
                    <Button
                        icon={startOverIcon}
                        content={startOverLabel}
                        disabled={disabled}
                        labelPosition="left"
                        onClick={this.onStartOver}
                    />
                )}

                <Button.Group>
                    {showPrev && (
                        <Button
                            icon={prevIcon}
                            content={prevLabel}
                            disabled={disabled}
                            labelPosition="left"
                            onClick={this.onPrev}
                        />
                    )}
                    {showNext && (
                        <Button
                            icon={nextIcon}
                            content={nextLabel}
                            disabled={disabled}
                            labelPosition="right"
                            onClick={this.onNext}
                        />
                    )}
                </Button.Group>
            </>
        );
    }
}

/**
 * @property {string} id step ID
 * @property {Function} onClose function calling wizard to close
 * @property {Function} onStartOver function calling wizard to start over wizard process
 * @property {Function} onPrev function calling wizard to move to the previous step
 * @property {Function} onNext function calling wizard to move to the next step
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
StepActions.propTypes = {
    id: PropTypes.string.isRequired,
    onClose: PropTypes.func.isRequired,
    onStartOver: PropTypes.func.isRequired,
    onPrev: PropTypes.func.isRequired,
    onNext: PropTypes.func.isRequired,
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
    showNext: PropTypes.bool,
    children: PropTypes.node,
    showClose: PropTypes.bool,
    closeOnRight: PropTypes.bool
};

StepActions.defaultProps = {
    disabled: false,

    showClose: true,
    closeOnRight: false,

    startOverLabel: 'Start Over',
    startOverIcon: 'undo',
    showStartOver: false,
    resetDataOnStartOver: false,

    prevLabel: 'Back',
    prevIcon: 'arrow left',
    showPrev: true,

    nextLabel: 'Next',
    nextIcon: 'arrow right',
    showNext: true,
    children: null
};
