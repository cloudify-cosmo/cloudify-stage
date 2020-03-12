package co.cloudify.rest.helpers;

import co.cloudify.rest.model.Execution;

/**
 * Provides callbacks for following executions. While following an execution, an
 * implementation of this interface may be called.
 * 
 * @author Isaac Shabtay
 */
public interface ExecutionFollowCallback {
    /**
     * Called before starting to follow the execution. This can be used for
     * initialization.
     * 
     * @param execution the execution to be followed
     */
    public void start(final Execution execution);

    /**
     * Called during following, when it is not yet known whether the execution has
     * ended.
     * 
     * @param execution the execution being followed
     */
    public void callback(final Execution execution);

    /**
     * Called exactly once, when it is known that the execution has ended.
     * 
     * @param execution the execution being followed
     */
    public void last(final Execution execution);

    /**
     * Called after {@link #last(Execution)}. This can be used for releasing
     * resources.
     * 
     * @param execution the execution being followed
     */
    public void end(final Execution execution);

    /**
     * Called when an exception has been raised while following.
     * 
     * @param execution the execution being followed
     * @param exception the exception that was raised
     */
    public void exception(final Execution execution, final Throwable exception);
}
