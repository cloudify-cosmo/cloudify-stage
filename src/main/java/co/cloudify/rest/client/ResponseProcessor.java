package co.cloudify.rest.client;

import java.io.IOException;

import javax.ws.rs.client.ClientRequestContext;
import javax.ws.rs.client.ClientResponseContext;
import javax.ws.rs.client.ClientResponseFilter;
import javax.ws.rs.core.Response.Status.Family;
import javax.ws.rs.core.Response.StatusType;
import javax.ws.rs.ext.Provider;

import co.cloudify.rest.client.exceptions.CloudifyClientException;

/**
 * Filter to use for all responses received from Cloudify Manager.
 * 
 * @author	Isaac Shabtay
 */
@Provider
public class ResponseProcessor implements ClientResponseFilter {
	@Override
	public void filter(ClientRequestContext requestContext, ClientResponseContext responseContext) throws IOException {
		StatusType statusInfo = responseContext.getStatusInfo();
		if (statusInfo.getFamily() != Family.SUCCESSFUL) {
			throw new IOException(
					new CloudifyClientException(statusInfo));
		}
	}
}
