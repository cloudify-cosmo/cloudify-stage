package co.cloudify.rest.client;

import java.util.Collections;
import java.util.Map;

import javax.ws.rs.HttpMethod;
import javax.ws.rs.client.Client;
import javax.ws.rs.client.Invocation;
import javax.ws.rs.client.Invocation.Builder;
import javax.ws.rs.client.WebTarget;
import javax.ws.rs.core.MediaType;

public class AbstractCloudifyClient {
	protected Client	api;
	protected WebTarget	base;
	
	protected AbstractCloudifyClient(final Client restClient, final WebTarget baseTarget) {
		super();
		api = restClient;
		base = baseTarget;
	}
	
	protected WebTarget getTarget(final String path) {
		return base.path(path);
	}
	
	protected WebTarget getTarget(final String path, final Map<String, Object> tokens) {
		WebTarget target = base.path(path);
		target = target.resolveTemplates(tokens);
		return target;
	}
	
	protected Invocation jsonGet(final String path) {
		return jsonGet(path, Collections.emptyMap());
	}

	protected Invocation jsonGet(final String path, final Map<String, Object> tokens) {
		return jsonRequest(path, HttpMethod.GET, tokens);
	}

	protected Builder getBuilder(final WebTarget target) {
		return target.request(MediaType.APPLICATION_JSON);
	}
	
	protected Invocation jsonRequest(final String path, final String method, final Map<String, Object> tokens) {
		WebTarget target = getTarget(path, tokens);
		Builder request = getBuilder(target);
		Invocation invocation = request.build(method);
		return invocation;
	}
}
