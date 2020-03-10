package co.cloudify.rest.client;

import javax.ws.rs.WebApplicationException;
import javax.ws.rs.client.Client;
import javax.ws.rs.client.WebTarget;
import javax.ws.rs.core.GenericType;

import co.cloudify.rest.client.exceptions.CloudifyClientException;
import co.cloudify.rest.client.params.EventsListParams;
import co.cloudify.rest.model.Event;
import co.cloudify.rest.model.EventType;
import co.cloudify.rest.model.Execution;
import co.cloudify.rest.model.ListResponse;

/**
 * Client for events and logs.
 * 
 * @author Isaac Shabtay
 */
public class EventsClient extends AbstractCloudifyClient {
    /** Base API path. */
    private static final String BASE_PATH = "/api/v3.1/events";

    public EventsClient(Client restClient, WebTarget base) {
        super(restClient, base);
    }

    /**
     * Lists events/logs for an execution.
     * 
     * @param execution   the execution
     * @param fromEvent   sequential number of the event to start from
     * @param batchSize   how many events to fetch
     * @param includeLogs whether to include logs
     * 
     * @return A {@link ListResponse} of {@link Event} instances.
     */
    public ListResponse<Event> list(final Execution execution, long fromEvent, long batchSize, boolean includeLogs) {
        return list(execution.getId(), fromEvent, batchSize, includeLogs);
    }

    /**
     * Lists all events/logs for an execution.
     * 
     * @param execution   the execution
     * @param includeLogs whether to include logs
     * 
     * @return A {@link ListResponse} of {@link Event} instances.
     */
    public ListResponse<Event> list(final Execution execution, boolean includeLogs) {
        return list(execution.getId(), includeLogs);
    }

    /**
     * Lists all events/logs for an execution.
     * 
     * @param executionId the execution ID
     * @param includeLogs whether to include logs
     * 
     * @return A {@link ListResponse} of {@link Event} instances.
     */
    public ListResponse<Event> list(final String executionId, boolean includeLogs) {
        return list(executionId, null, null, includeLogs);
    }

    /**
     * Lists events and logs for a specific execution.
     * 
     * @param executionId the execution ID
     * @param fromEvent   sequential number of the event to start from
     * @param batchSize   how many events to fetch
     * @param includeLogs whether to include logs
     * 
     * @return A {@link ListResponse} of {@link Event} instances.
     */
    public ListResponse<Event> list(final String executionId, Long fromEvent, Long batchSize, boolean includeLogs) {
        WebTarget target = getTarget(BASE_PATH);
        EventsListParams params = EventsListParams.build()
                .type(EventType.cloudify_event)
                .executionId(executionId)
                .allResults(fromEvent == null && batchSize == null)
                .offset(fromEvent)
                .size(batchSize)
                .includeLogs(includeLogs);
        target = params.update(target);
        try {
            return getBuilder(target).get(new GenericType<ListResponse<Event>>() {});
        } catch (WebApplicationException ex) {
            throw CloudifyClientException.create("Failed retrieving events/logs", ex);

        }
    }
}
