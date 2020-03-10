package co.cloudify.rest.helpers;

import java.util.List;

import co.cloudify.rest.client.CloudifyClient;
import co.cloudify.rest.client.EventsClient;
import co.cloudify.rest.model.Event;
import co.cloudify.rest.model.EventLevel;
import co.cloudify.rest.model.Execution;
import co.cloudify.rest.model.ListResponse;
import co.cloudify.rest.model.Pagination;

public abstract class LogEmitterExecutionFollower extends DefaultExecutionFollowCallback {
    private static final long DEFAULT_SIZE = 1000;

    private EventsClient client;
    private long offset;
    private long size;
    private EventLevel minimumLevel;

    public LogEmitterExecutionFollower(final CloudifyClient client) {
        this(client, DEFAULT_SIZE);
    }

    public LogEmitterExecutionFollower(final CloudifyClient client, final long size) {
        this(client, size, EventLevel.info);
    }

    public LogEmitterExecutionFollower(final CloudifyClient client, final EventLevel minimumLevel) {
        this(client, DEFAULT_SIZE, minimumLevel);
    }

    public LogEmitterExecutionFollower(final CloudifyClient client, final long size, final EventLevel minimumLevel) {
        super();
        this.client = client.getEventsClient();
        this.size = size;
        this.minimumLevel = minimumLevel;
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
    public void last(Execution execution) {
        fetch(execution);
    }

    protected abstract void emit(final Event event);

    protected void fetch(Execution execution) {
        int minimumNumeric = minimumLevel.numeric();
        while (true) {
            ListResponse<Event> listResponse = client.list(execution, offset, size, true);
            Pagination pagination = listResponse.getMetadata().getPagination();
            List<Event> items = listResponse.getItems();
            items
                    .stream()
                    .filter(event -> event.getLevel() == null || event.getLevel().numeric() >= minimumNumeric)
                    .forEach(x -> emit(x));
            offset += items.size();
            if (offset >= pagination.getTotal()) {
                break;
            }
        }
    }
}
