package co.cloudify.rest.helpers;

import java.io.PrintStream;

import co.cloudify.rest.client.CloudifyClient;
import co.cloudify.rest.model.Event;
import co.cloudify.rest.model.EventLevel;
import co.cloudify.rest.model.Execution;

/**
 * A {@link LogEmitterExecutionFollower} implementation that prints to a
 * {@link PrintStream}. This is useful, among others, for Jenkins, as Jenkins'
 * log is a {@link PrintStream}.
 * 
 * @author Isaac Shabtay
 */
public class PrintStreamLogEmitterExecutionFollower extends LogEmitterExecutionFollower {
    private PrintStream printStream;

    public PrintStreamLogEmitterExecutionFollower(final CloudifyClient client, final PrintStream printStream) {
        super(client);
        this.printStream = printStream;
    }

    public PrintStreamLogEmitterExecutionFollower(final CloudifyClient client, final PrintStream printStream,
            final EventLevel minimumLevel) {
        super(client, minimumLevel);
        this.printStream = printStream;
    }

    public PrintStreamLogEmitterExecutionFollower(final CloudifyClient client, final PrintStream printStream,
            final long size) {
        super(client, size);
        this.printStream = printStream;
    }

    public PrintStreamLogEmitterExecutionFollower(final CloudifyClient client, final PrintStream printStream,
            final long size,
            final EventLevel minimumLevel) {
        super(client, size, minimumLevel);
        this.printStream = printStream;
    }

    @Override
    protected void emit(final Event event) {
        printStream.println(EventsHelper.formatEvent(event));
    }

    @Override
    public void exception(Execution execution, Throwable exception) {
        printStream.println("Exception encountered");
        exception.printStackTrace(printStream);
    }
}
