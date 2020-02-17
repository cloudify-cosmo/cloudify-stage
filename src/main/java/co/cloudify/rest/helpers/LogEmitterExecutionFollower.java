package co.cloudify.rest.helpers;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import co.cloudify.rest.client.CloudifyClient;
import co.cloudify.rest.client.EventsClient;
import co.cloudify.rest.model.Event;
import co.cloudify.rest.model.Execution;
import co.cloudify.rest.model.ListResponse;
import co.cloudify.rest.model.Pagination;

public abstract class LogEmitterExecutionFollower extends DefaultExecutionFollowCallback {
	private static final Logger logger = LoggerFactory.getLogger(LogEmitterExecutionFollower.class);
	
	private static final long DEFAULT_SIZE = 1000;

	private EventsClient client;
	private long offset;
	private long size;

	public LogEmitterExecutionFollower(final CloudifyClient client) {
		this(client, DEFAULT_SIZE);
	}

	public LogEmitterExecutionFollower(final CloudifyClient client, final long size) {
		super();
		this.client = client.getEventsClient();
		this.size = size;
	}

	@Override
	public void start(Execution execution) {
		offset = 0;
	}
	
	@Override
	public void callback(Execution execution) {
		fetch(execution);
	}
	
	@Override
	public void end(Execution execution) {
		fetch(execution);
	}

	protected abstract void emit(final Event event);
	
	protected void fetch(Execution execution) {
		while(true) {
			ListResponse<Event> listResponse = client.list(execution, offset, size, true);
			Pagination pagination = listResponse.getMetadata().getPagination();
			List<Event> items = listResponse.getItems();
			items.forEach(x -> emit(x));
			offset += items.size();
			if (offset >= pagination.getTotal()) {
				break;
			}
		}
	}
}
