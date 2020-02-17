package co.cloudify.rest.helpers;

import java.io.PrintStream;

import co.cloudify.rest.client.CloudifyClient;
import co.cloudify.rest.model.Event;

public class PrintStreamLogEmitterExecutionFollower extends LogEmitterExecutionFollower {
	private PrintStream printStream;

	public PrintStreamLogEmitterExecutionFollower(final CloudifyClient client, final PrintStream printStream) {
		super(client);
		this.printStream = printStream;
	}

	public PrintStreamLogEmitterExecutionFollower(final CloudifyClient client, final PrintStream printStream, final long size) {
		super(client, size);
		this.printStream = printStream;
	}

	@Override
	protected void emit(final Event event) {
		String text = EventsHelper.formatEvent(event);
		System.err.println(text);
		printStream.println(text);
	}
}
