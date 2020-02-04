package co.cloudify.rest.client;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.ws.rs.client.Client;
import javax.ws.rs.client.Entity;
import javax.ws.rs.client.WebTarget;
import javax.ws.rs.core.GenericType;

import co.cloudify.rest.model.Execution;
import co.cloudify.rest.model.ListResponse;

public class ExecutionsClient extends AbstractCloudifyClient {
	private static final String BASE_PATH = "/api/v3.1/executions";
	private static final String ID_PATH = BASE_PATH + "/{id}";
	
	public ExecutionsClient(Client restClient, WebTarget baseTarget) {
		super(restClient, baseTarget);
	}

	protected WebTarget getExecutionsTarget() {
		return getTarget(BASE_PATH);
	}
	
	protected WebTarget getExecutionsTarget(String id) {
		return getTarget(ID_PATH, Collections.singletonMap("id", id));
	}
	
	public Execution get(String id) {
		return getBuilder(getExecutionsTarget(id)).get(Execution.class);
	}
	
	public List<Execution> list() {
		return getBuilder(getExecutionsTarget()).get(new GenericType<ListResponse<Execution>>() {}).getItems();
	}
	
	public Execution start(String deploymentId, String workflowId, Map<String, Object> parameters) {
		Map<String, Object> body = new HashMap<String, Object>();
		body.put("workflow_id", workflowId);
		body.put("deployment_id", deploymentId);
		if (parameters != null) {
			body.put("parameters", parameters);
		}
		Execution response = getBuilder(getExecutionsTarget()).buildPost(Entity.json(body)).invoke(Execution.class);
		return response;
	}
}
