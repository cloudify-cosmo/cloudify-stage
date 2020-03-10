/**
 * <p>
 * Contains the hierarchy of various REST API clients.
 * </p>
 * 
 * <p>
 * The focal point is {@link CloudifyClient}:
 * </p>
 * 
 * <ul>
 * <li>Use the {@link CloudifyClient#create(String, String, String, boolean, String)} factory method
 * to create a {@link CloudifyClient} instance.</li>
 * <li>Then, use the various <code>getXXXClient</code> methods to get domain-specific
 * clients (such as {@link CloudifyClient#getBlueprintsClient()}, {@link CloudifyClient#getDeploymentsClient()}
 * and so forth).
 * </ul>
 * 
 * @author Isaac Shabtay
 */
package co.cloudify.rest.client;

import co.cloudify.rest.client.CloudifyClient;