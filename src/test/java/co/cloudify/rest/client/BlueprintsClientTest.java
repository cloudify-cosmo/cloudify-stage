package co.cloudify.rest.client;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.mock;

import javax.ws.rs.NotFoundException;
import javax.ws.rs.client.Invocation.Builder;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import co.cloudify.rest.client.exceptions.BlueprintNotFoundException;
import co.cloudify.rest.model.Blueprint;

public class BlueprintsClientTest {
    private static final String BLUEPRINT_ID = "blueprint-id";

    private BlueprintsClient blueprintsClient;
    private Builder builder;

    @BeforeEach
    public void initTest() {
        blueprintsClient = mock(BlueprintsClient.class);
        Mockito.when(blueprintsClient.get(BLUEPRINT_ID)).thenCallRealMethod();
        Mockito.when(blueprintsClient.delete(BLUEPRINT_ID)).thenCallRealMethod();
        builder = mock(Builder.class);
        Mockito.when(blueprintsClient.getBuilder(BLUEPRINT_ID)).thenReturn(builder);
    }

    @Test
    public void testGetNormal() {
        Blueprint blueprint = new Blueprint();
        Mockito.when(builder.get(Blueprint.class)).thenReturn(blueprint);
        Blueprint returned = blueprintsClient.get(BLUEPRINT_ID);
        assertTrue(returned == blueprint);
    }

    @Test
    public void testGetNotFound() {
        Mockito.when(builder.get(Blueprint.class)).thenThrow(NotFoundException.class);
        assertThrows(BlueprintNotFoundException.class, () -> blueprintsClient.get(BLUEPRINT_ID));
    }

    @Test
    public void testDeleteNormal() {
        Blueprint blueprint = new Blueprint();
        Mockito.when(builder.delete(Blueprint.class)).thenReturn(blueprint);
        Blueprint returned = blueprintsClient.delete(BLUEPRINT_ID);
        assertTrue(returned == blueprint);
    }

    @Test
    public void testDeleteNotFound() {
        Mockito.when(builder.delete(Blueprint.class)).thenThrow(NotFoundException.class);
        assertThrows(BlueprintNotFoundException.class, () -> blueprintsClient.delete(BLUEPRINT_ID));
    }
}
