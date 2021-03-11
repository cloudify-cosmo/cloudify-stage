interface FibonacciSequenceWidgetConfiguration {
    targetSequenceLength: number;
    sequence?: number[];
}

const initialSequence = [1, 1];
const widgetId = 'fibonacci-sequence-widget';

/**
 * An example widget that renders itself recursively. Each widget computes the next number in the
 * Fibonacci sequence and displays it, while passing the sequence to the next widget, until the
 * target sequence length is reached.
 */
Stage.defineWidget<unknown, unknown, FibonacciSequenceWidgetConfiguration>({
    id: widgetId,
    name: 'Fibonacci sequence widget',
    isReact: true,
    initialConfiguration: [
        {
            id: 'targetSequenceLength',
            name: 'Target sequence length',
            default: 1,
            type: Stage.Basic.GenericField.NUMBER_TYPE
        },
        {
            id: 'sequence',
            name: 'Sequence',
            type: Stage.Basic.GenericField.NUMBER_LIST_TYPE,
            default: initialSequence
        }
    ],
    render: widget => {
        const { WidgetsList } = Stage.Common;
        const { targetSequenceLength, sequence = initialSequence } = widget.configuration;

        return (
            <div>
                Current sequence: {JSON.stringify(sequence)}
                {sequence.length < targetSequenceLength && (
                    <WidgetsList
                        isEditMode={false}
                        onWidgetRemoved={_.noop}
                        onWidgetUpdated={_.noop}
                        widgets={[
                            {
                                id: widgetId,
                                configuration: {
                                    targetSequenceLength,
                                    sequence: [...sequence, getNextFibonacciNumber(sequence)]
                                },
                                definition: widgetId,
                                drillDownPages: {},
                                height: 1,
                                width: 12,
                                maximized: false,
                                name: `Sequence of length ${sequence.length + 1}`,
                                x: 0,
                                y: 0
                            }
                        ]}
                    />
                )}
            </div>
        );
    }
});

const getNextFibonacciNumber = (sequence: number[]) => {
    const len = sequence.length;

    return sequence[len - 2] + sequence[len - 1];
};
