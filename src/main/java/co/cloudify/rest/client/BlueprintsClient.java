package co.cloudify.rest.client;

import java.util.Collections;

import javax.ws.rs.client.Client;
import javax.ws.rs.client.WebTarget;
import javax.ws.rs.core.GenericType;

import co.cloudify.rest.model.Blueprint;
import co.cloudify.rest.model.ListResponse;

public class BlueprintsClient extends AbstractCloudifyClient {
	private static final String BASE_PATH = "/api/v3.1/blueprints";
	private static final String ID_PATH = BASE_PATH + "/{id}";

	public BlueprintsClient(Client restClient, WebTarget base) {
		super(restClient, base);
	}
	
	protected WebTarget getBlueprintTarget(final String id) {
		return getTarget(ID_PATH, Collections.singletonMap("id", id));
	}

	/**
	 * Get a blueprint by ID.
	 * 
	 * @param	id	ID of blueprint to get
	 * 
	 * @return	A {@link Blueprint} instance for that blueprint.
	 */
	public Blueprint get(final String id) {
		return getBuilder(
				getBlueprintTarget(id)
				).get(Blueprint.class);
	}
	
	/**
	 * Deletes a blueprint.
	 * 
	 * @param	id	ID of blueprint to delete
	 */
	public void delete(final String id) {
		getBuilder(
				getBlueprintTarget(id)
				).delete();
	}
	
	/**
	 * @return	A list of all blueprints.
	 */
	public ListResponse<Blueprint> list() {
		return jsonGet(BASE_PATH).invoke(new GenericType<ListResponse<Blueprint>>() {});
	}
}
