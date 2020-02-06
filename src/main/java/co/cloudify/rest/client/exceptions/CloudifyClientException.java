package co.cloudify.rest.client.exceptions;

import javax.ws.rs.core.Response.StatusType;

/**
 * Generic exception thrown when receiving a bad response code from
 * Cloudify Manager.
 * 
 * @author	Isaac Shabtay
 */
public class CloudifyClientException extends Exception {
	/**	Serialization UID. */
	private static final long serialVersionUID = 1L;

	public CloudifyClientException() {
		super();
	}
	
	public CloudifyClientException(final String msg, final Throwable root) {
		super(msg, root);
	}

	public CloudifyClientException(final StatusType statusType) {
		super(String.format("Unexpected status encountered: %d (%s)", statusType.getStatusCode(),
				statusType.getReasonPhrase()));
	}
}
