package co.cloudify.rest.client.params;

import java.util.HashSet;
import java.util.Set;

import javax.ws.rs.client.WebTarget;

import co.cloudify.rest.model.EventType;

public class EventsListParams {
	private Set<EventType> types;
	private	String	executionId;
	private	String	sort;
	private	Boolean	getAllResults;
	private	Long	offset;
	private	Long	size;
	
	protected EventsListParams() {
		super();
		types = new HashSet<>();
	}
	
	public static EventsListParams build() {
		EventsListParams params = new EventsListParams();
		params.sort = "reported_timestamp";
		return params;
	}
	
	public EventsListParams executionId(final String id) {
		executionId = id;
		return this;
	}

	public EventsListParams type(final EventType type) {
		types.add(type);
		return this;
	}
	
	public EventsListParams allResults() {
		return allResults(true);
	}

	public EventsListParams allResults(final boolean b) {
		getAllResults = b;
		return this;
	}
	
	public EventsListParams offset(final Long l) {
		offset = l;
		return this;
	}

	public EventsListParams size(final Long s) {
		size = s;
		return this;
	}
	
	public EventsListParams includeLogs (final boolean b) {
		if (b) {
			types.add(EventType.cloudify_log);
		}
		return this;
	}
	
	public WebTarget update(WebTarget target) {
		for (EventType type: types) {
			target = target.queryParam("type", type);
		}
		target = target
				.queryParam("execution_id", executionId)
				.queryParam("_sort", sort);
		
		if (Boolean.TRUE.equals(getAllResults)) {
			target = target.queryParam("_get_all_results", true);
		} else {
			if (offset == null || size == null) {
				throw new IllegalArgumentException("offset and size must not be null");
			}
			target = target
					.queryParam("_offset", offset)
					.queryParam("_size", size);
			
		}
		return target;
	}
}
