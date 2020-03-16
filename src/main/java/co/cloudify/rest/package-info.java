/**
 * <p>
 * A pure-Java implementation for Cloudify Manager's REST API.
 * </p>
 * <h1>Prerequisites</h1>
 * <p>
 * This library assumes Java 8 onwards. On top of what's offered in Java 8, this library
 * uses:
 * </p>
 * <ul>
 * <li><b>JAX-RS 2.x</b>. It is the user's responsibility to plug in a JAX-RS 2.0+ compatible
 * provider (such as Apache Jersey) during runtime.</li>
 * <li><b>JSR-353</b> (Java API for JSON Processing). It is the user's responsibility to plugin a
 * JSR-353 implementation (such as Glassfish's) during runtime.</li>
 * </ul>
 * <p>
 * Logging is done using SLF4J. It is the user's responsibility to provide an
 * SLF4J implementation to their runtime environment.
 * </p>
 * <h1>Structure</h1>
 * <ul>
 * <li><code>co.cloudify.rest.client</code>: this will be your focal point for obtaining REST client
 * instances (see {@link co.cloudify.rest.client.CloudifyClient}).</li>
 * <li><code>co.cloudify.rest.model</code>: contains model classes for various request/response entities.</li>
 * </ul>
 * 
 * @author Isaac Shabtay
 */
package co.cloudify.rest;
