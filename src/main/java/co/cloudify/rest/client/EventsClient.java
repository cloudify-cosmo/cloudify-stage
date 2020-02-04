package co.cloudify.rest.client;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.ws.rs.client.Client;
import javax.ws.rs.client.Invocation;
import javax.ws.rs.client.WebTarget;
import javax.ws.rs.core.GenericType;

import co.cloudify.rest.model.Event;
import co.cloudify.rest.model.ListResponse;

public class EventsClient extends AbstractCloudifyClient {
	public EventsClient(Client restClient, WebTarget base) {
		super(restClient, base);
	}
	
	public List<Event> list(final String executionId, long fromEvent, long batchSize, boolean includeLogs) {
		Map<String, Object> parameters = new HashMap<String, Object>();
		
		parameters.put("_sort", "@timestamp");
		WebTarget target = getTarget("/api/v3.1/events")
				.queryParam("type", "cloudify_event")
				.queryParam("execution_id", executionId)
				.queryParam("_sort", "@reported_timestamp");
		if (fromEvent == Long.MIN_VALUE && batchSize == Long.MIN_VALUE) {
			target = target.queryParam("_get_all_results", true);
		} else {
			target = target
					.queryParam("_offset", fromEvent)
					.queryParam("_size", batchSize);
		}
		if (includeLogs) {
			target = target.queryParam("type", "cloudify_log");
		}
		Invocation invocation = getBuilder(target).buildGet();
		ListResponse<Event> response = invocation.invoke(new GenericType<ListResponse<Event>>() {});
		return response.getItems();
	}

	public List<Event> list(final String executionId, boolean includeLogs) {
		return list(executionId, Long.MIN_VALUE, Long.MIN_VALUE, includeLogs);
	}
}
