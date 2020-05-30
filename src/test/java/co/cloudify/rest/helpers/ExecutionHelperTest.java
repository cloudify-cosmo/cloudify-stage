package co.cloudify.rest.helpers;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.spy;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.mockito.invocation.InvocationOnMock;
import org.mockito.stubbing.Answer;

import co.cloudify.rest.client.ExecutionsClient;
import co.cloudify.rest.model.Execution;
import co.cloudify.rest.model.ExecutionStatus;

public class ExecutionHelperTest {
    @Test
    public void testFollowExecution() throws Exception {
        String EXECUTION_ID = "execution-id";

        ExecutionsClient executionsClient = mock(ExecutionsClient.class);
        Execution initialExecution = new Execution();
        initialExecution.setId(EXECUTION_ID);
        initialExecution.setStatus(ExecutionStatus.started);
        Execution finalExecution = new Execution();
        finalExecution.setId(EXECUTION_ID);
        finalExecution.setStatus(ExecutionStatus.terminated);

        Mockito.when(executionsClient.get(EXECUTION_ID)).thenAnswer(new Answer<Execution>() {
            private int callCount = 0;

            @Override
            public Execution answer(InvocationOnMock invocation) throws Throwable {
                ++callCount;
                return callCount == 3 ? finalExecution : initialExecution;
            }
        });

        ExecutionFollowCallback callback = spy(new DefaultExecutionFollowCallback());
        ExecutionsHelper.followExecution(executionsClient, initialExecution, callback, 0);
        verify(callback, times(1)).start(initialExecution);
        verify(callback, times(2)).callback(initialExecution);
        verify(callback, times(1)).callback(finalExecution);
        verify(callback, times(1)).last(finalExecution);
        verify(callback, times(1)).end(finalExecution);
    }
}
