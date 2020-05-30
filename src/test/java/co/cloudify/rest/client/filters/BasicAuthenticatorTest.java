package co.cloudify.rest.client.filters;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import javax.ws.rs.core.MultivaluedMap;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

public class BasicAuthenticatorTest extends FilterTestBase {
    private BasicAuthenticator authenticator;

    @BeforeEach
    public void initTest() {
        authenticator = new BasicAuthenticator("testuser", "testpassword");
    }

    @Test
    public void testBlankFields() throws Exception {
        assertThrows(NullPointerException.class, () -> new BasicAuthenticator(null, "testpassword"));
        assertThrows(NullPointerException.class, () -> new BasicAuthenticator("testuser", null));
        assertThrows(NullPointerException.class, () -> new BasicAuthenticator(null, null));
        assertThrows(IllegalArgumentException.class, () -> new BasicAuthenticator("    ", "    "));
    }

    @Test
    public void testHeader() throws Exception {
        invoke(authenticator);
        MultivaluedMap<String, Object> headers = requestContext.getHeaders();
        assertTrue(headers.size() == 1);
        assertEquals(headers.get("Authorization").get(0), "BASIC dGVzdHVzZXI6dGVzdHBhc3N3b3Jk");
    }
}
