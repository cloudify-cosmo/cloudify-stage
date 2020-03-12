package co.cloudify.rest.helpers;

import org.slf4j.Logger;

import co.cloudify.rest.client.CloudifyClient;
import co.cloudify.rest.model.Event;
import co.cloudify.rest.model.EventLevel;
import co.cloudify.rest.model.Execution;

/**
 * A {@link LogEmitterExecutionFollower} implementation that outputs to an SLF4J
 * logger.
 * 
 * @author Isaac Shabtay
 */
public class Slf4JLogEmitterExecutionFollower extends LogEmitterExecutionFollower {
    private Logger logger;

    public Slf4JLogEmitterExecutionFollower(final CloudifyClient client, final Logger logger) {
        super(client);
        this.logger = logger;
    }

    public Slf4JLogEmitterExecutionFollower(final CloudifyClient client, final Logger logger,
            final EventLevel minimumLevel) {
        super(client, minimumLevel);
        this.logger = logger;
    }

    public Slf4JLogEmitterExecutionFollower(final CloudifyClient client, final Logger logger, final long size) {
        super(client, size);
        this.logger = logger;
    }

    public Slf4JLogEmitterExecutionFollower(final CloudifyClient client, final Logger logger, final long size,
            final EventLevel minimumLevel) {
        super(client, size, minimumLevel);
        this.logger = logger;
    }

    @Override
    protected void emit(final Event event) {
        EventLevel level = event.getLevel();
        String text = EventsHelper.formatEvent(event, false);
        // Apparently SLF4J doesn't offer a logging method that accepts a level
        // as a parameter...
        switch (level) {
        case debug:
            logger.debug(text);
            break;
        case error:
            logger.error(text);
            break;
        case info:
            logger.info(text);
            break;
        case warning:
            logger.warn(text);
            break;
        default:
            logger.info("[Unrecognized level: {}] {}", level, text);
            break;
        }
    }

    @Override
    public void exception(Execution execution, Throwable exception) {
        logger.error("Exception encountered while following execution", exception);
    }
}
