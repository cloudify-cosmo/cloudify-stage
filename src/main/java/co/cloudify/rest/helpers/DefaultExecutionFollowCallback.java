package co.cloudify.rest.helpers;

import co.cloudify.rest.model.Execution;

/**
 * Skeleton for {@link ExecutionFollowCallback} that does nothing.
 * 
 * @author Isaac Shabtay
 */
public class DefaultExecutionFollowCallback implements ExecutionFollowCallback {
    private static final DefaultExecutionFollowCallback SINGLETON_INSTANCE = new DefaultExecutionFollowCallback();

    /**
     * @return Singleton instance.
     */
    public static final DefaultExecutionFollowCallback getInstance() {
        return SINGLETON_INSTANCE;
    }

    @Override
    public void start(Execution execution) {
        // Nothing.
    }

    @Override
    public void callback(Execution execution) {
        // Nothing.
    }

    @Override
    public void last(Execution execution) {
        // Nothing.
    }

    @Override
    public void end(Execution execution) {
        // Nothing.
    }

    @Override
    public void exception(Execution execution, Throwable exception) {
        // Nothing.
    }
}
