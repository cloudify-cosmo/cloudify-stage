package co.cloudify.rest.client;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.mock;

import javax.ws.rs.NotFoundException;
import javax.ws.rs.client.Invocation.Builder;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import co.cloudify.rest.client.exceptions.ExecutionNotFoundException;
import co.cloudify.rest.model.Execution;

public class ExecutionsClientTest {
    private static final String EXECUTION_ID = "execution-id";

    private ExecutionsClient executionsClient;
    private Builder builder;

    @BeforeEach
    public void initTest() {
        executionsClient = mock(ExecutionsClient.class);
        Mockito.when(executionsClient.get(EXECUTION_ID)).thenCallRealMethod();
        builder = mock(Builder.class);
        Mockito.when(executionsClient.getExecutionBuilder(EXECUTION_ID)).thenReturn(builder);
    }

    @Test
    public void testGetNormal() {
        Execution execution = new Execution();
        Mockito.when(builder.get(Execution.class)).thenReturn(execution);
        Execution returned = executionsClient.get(EXECUTION_ID);
        assertTrue(returned == execution);
    }

    @Test
    public void testGetNotFound() {
        Mockito.when(builder.get(Execution.class)).thenThrow(NotFoundException.class);
        assertThrows(ExecutionNotFoundException.class, () -> executionsClient.get(EXECUTION_ID));
    }

}
