package co.cloudify.rest.helpers;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.spy;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.Map;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.mockito.invocation.InvocationOnMock;
import org.mockito.stubbing.Answer;

import co.cloudify.rest.client.CloudifyClient;
import co.cloudify.rest.client.DeploymentsClient;
import co.cloudify.rest.client.ExecutionsClient;
import co.cloudify.rest.client.exceptions.DeploymentNotFoundException;
import co.cloudify.rest.model.Deployment;
import co.cloudify.rest.model.Execution;
import co.cloudify.rest.model.ExecutionStatus;
import co.cloudify.rest.model.ListResponse;
import co.cloudify.rest.model.Metadata;
import co.cloudify.rest.model.Pagination;

public class DeploymentsHelperTest {
    private static final String EXECUTION_ID = "execution-id";
    private static final String BLUEPRINT_ID = "blueprint-id";
    private static final String DEPLOYMENT_ID = "deployment-id";
    private static final Map<String, Object> INPUTS = Collections.unmodifiableMap(new LinkedHashMap<>());

    private CloudifyClient client;
    private Deployment deployment;

    @BeforeEach
    public void initTest() throws Exception {
        DeploymentsClient deploymentsClient = mock(DeploymentsClient.class);
        ExecutionsClient executionsClient = mock(ExecutionsClient.class);
        client = mock(CloudifyClient.class);
        Mockito.when(client.getDeploymentsClient()).thenReturn(deploymentsClient);
        Mockito.when(client.getExecutionsClient()).thenReturn(executionsClient);

        deployment = new Deployment();
        deployment.setId(DEPLOYMENT_ID);
        deployment.setBlueprintId(BLUEPRINT_ID);
        Mockito.when(deploymentsClient.create(DEPLOYMENT_ID, BLUEPRINT_ID, INPUTS)).thenReturn(deployment);
    }

    @Test
    public void testNoDepCreationExecution() throws Exception {
        Metadata metadata = new Metadata(new Pagination(0, 0, 0));
        ListResponse<Execution> emptyList = new ListResponse<>();
        emptyList.setItems(Collections.emptyList());
        emptyList.setMetadata(metadata);

        Mockito.when(client.getExecutionsClient().list(deployment)).thenReturn(emptyList);

        assertThrows(IllegalStateException.class,
                () -> DeploymentsHelper.createDeploymentAndWait(client, DEPLOYMENT_ID, BLUEPRINT_ID, INPUTS, null, 0));
    }

    @Test
    public void testDepCreationOptimumPath() throws Exception {
        Metadata metadata = new Metadata(new Pagination(1, 0, 1));
        ListResponse<Execution> executions = new ListResponse<>();
        Execution initialExecution = new Execution();
        initialExecution.setId(EXECUTION_ID);
        initialExecution.setDeploymentId(DEPLOYMENT_ID);
        initialExecution.setWorkflowId("create_deployment_environment");
        initialExecution.setStatus(ExecutionStatus.started);
        executions.setItems(Collections.singletonList(initialExecution));
        executions.setMetadata(metadata);

        Execution finalExecution = new Execution();
        finalExecution.setId(initialExecution.getId());
        finalExecution.setDeploymentId(initialExecution.getDeploymentId());
        finalExecution.setWorkflowId(initialExecution.getWorkflowId());
        finalExecution.setStatus(ExecutionStatus.terminated);

        ExecutionsClient executionsClient = client.getExecutionsClient();
        Mockito.when(executionsClient.list(deployment)).thenReturn(executions);
        Mockito.when(executionsClient.get(EXECUTION_ID)).thenAnswer(new Answer<Execution>() {
            private int callCount = 0;

            @Override
            public Execution answer(InvocationOnMock invocation) throws Throwable {
                ++callCount;
                return callCount == 3 ? finalExecution : initialExecution;
            }
        });

        ExecutionFollowCallback callback = spy(new DefaultExecutionFollowCallback());
        DeploymentsHelper.createDeploymentAndWait(client, DEPLOYMENT_ID, BLUEPRINT_ID, INPUTS, callback, 0);
        verify(callback, times(1)).start(initialExecution);
        verify(callback, times(2)).callback(initialExecution);
        verify(callback, times(1)).callback(finalExecution);
        verify(callback, times(1)).last(finalExecution);
        verify(callback, times(1)).end(finalExecution);
    }

    @Test
    public void testDepDeletionOptimumPath() throws Exception {
        DeploymentsClient deploymentsClient = client.getDeploymentsClient();
        Mockito.when(deploymentsClient.delete(DEPLOYMENT_ID)).thenReturn(deployment);
        Mockito.when(deploymentsClient.get(DEPLOYMENT_ID)).thenAnswer(new Answer<Deployment>() {
            private int callCount = 0;

            @Override
            public Deployment answer(InvocationOnMock invocation) throws Throwable {
                ++callCount;
                if (callCount == 3) {
                    throw new DeploymentNotFoundException(DEPLOYMENT_ID, null);
                }
                return deployment;
            }
        });

        DeploymentsHelper.deleteDeploymentAndWait(client, DEPLOYMENT_ID, 0);
        verify(deploymentsClient, times(3)).get(DEPLOYMENT_ID);
    }
}
