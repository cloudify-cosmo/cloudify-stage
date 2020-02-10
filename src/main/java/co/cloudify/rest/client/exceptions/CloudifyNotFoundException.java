package co.cloudify.rest.client.exceptions;

import javax.ws.rs.core.Response.StatusType;

/**
 * Generic exception thrown when receiving a bad response code from
 * Cloudify Manager.
 * 
 * @author	Isaac Shabtay
 */
public class CloudifyNotFoundException extends CloudifyClientException {
	/**	Serialization UID. */
	private static final long serialVersionUID = 1L;

	public CloudifyNotFoundException() {
		super();
	}
	
	public CloudifyNotFoundException(final String msg, final Throwable root) {
		super(msg, root);
	}

	public CloudifyNotFoundException(final String requestPath, final StatusType status) {
		this(String.format("Unexpected status encountered: %d (%s)", status.getStatusCode(),
				status.getReasonPhrase()), requestPath, status);
	}
	
	public CloudifyNotFoundException(final String message, final String requestPath, final StatusType status) {
		super(message, requestPath, status);
	}
}
