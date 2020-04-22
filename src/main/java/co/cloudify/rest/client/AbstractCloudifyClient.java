package co.cloudify.rest.client;

import java.util.Map;

import javax.ws.rs.client.Client;
import javax.ws.rs.client.Invocation.Builder;
import javax.ws.rs.client.WebTarget;
import javax.ws.rs.core.MediaType;

import org.apache.commons.lang3.StringUtils;

/**
 * Root class for all Cloudify clients.
 * 
 * @author Isaac Shabtay
 */
public class AbstractCloudifyClient {
    /** Underlying HTTP client. */
    protected Client api;
    /** A {@link WebTarget} instance representing the base path. */
    protected WebTarget base;

    protected AbstractCloudifyClient(final Client restClient, final WebTarget baseTarget) {
        super();
        api = restClient;
        base = baseTarget;
    }

    protected WebTarget getTarget(final String path) {
        return base.path(path);
    }

    protected WebTarget getTarget(final String path, final Map<String, Object> tokens) {
        return getTarget(path)
                .resolveTemplates(tokens);
    }

    protected Builder getBuilder(final WebTarget target) {
        return target.request(MediaType.APPLICATION_JSON);
    }

    protected WebTarget commonListParams(WebTarget target, final String searchString,
            final String sortKey,
            final boolean descending) {
        if (StringUtils.isNotBlank(searchString)) {
            target = target.queryParam("_search", searchString);
        }
        if (StringUtils.isNotBlank(sortKey)) {
            target = target.queryParam("_sort", String.format("%s%s",
                    descending ? "-" : StringUtils.EMPTY, sortKey));
        }
        return target;
    }
}
