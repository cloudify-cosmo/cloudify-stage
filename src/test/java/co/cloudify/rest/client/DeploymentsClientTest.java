package co.cloudify.rest.client;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.mock;

import javax.ws.rs.NotFoundException;
import javax.ws.rs.client.Invocation.Builder;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import co.cloudify.rest.client.exceptions.DeploymentNotFoundException;
import co.cloudify.rest.model.Deployment;

public class DeploymentsClientTest {
    private static final String DEPLOYMENT_ID = "deployment-id";

    private DeploymentsClient deploymentsClient;
    private Builder builder;

    @BeforeEach
    public void initTest() {
        deploymentsClient = mock(DeploymentsClient.class);
        Mockito.when(deploymentsClient.get(DEPLOYMENT_ID)).thenCallRealMethod();
        Mockito.when(deploymentsClient.delete(DEPLOYMENT_ID)).thenCallRealMethod();
        builder = mock(Builder.class);
        Mockito.when(deploymentsClient.getDeploymentIdBuilder(DEPLOYMENT_ID)).thenReturn(builder);
    }

    @Test
    public void testGetNormal() {
        Deployment deployment = new Deployment();
        Mockito.when(builder.get(Deployment.class)).thenReturn(deployment);
        Deployment returned = deploymentsClient.get(DEPLOYMENT_ID);
        assertTrue(returned == deployment);
    }

    @Test
    public void testGetNotFound() {
        Mockito.when(builder.get(Deployment.class)).thenThrow(NotFoundException.class);
        assertThrows(DeploymentNotFoundException.class, () -> deploymentsClient.get(DEPLOYMENT_ID));
    }

    @Test
    public void testDeleteNormal() {
        Deployment deployment = new Deployment();
        Mockito.when(builder.delete(Deployment.class)).thenReturn(deployment);
        Deployment returned = deploymentsClient.delete(DEPLOYMENT_ID);
        assertTrue(returned == deployment);
    }

    @Test
    public void testDeleteNotFound() {
        Mockito.when(builder.delete(Deployment.class)).thenThrow(NotFoundException.class);
        assertThrows(DeploymentNotFoundException.class, () -> deploymentsClient.delete(DEPLOYMENT_ID));
    }
}
