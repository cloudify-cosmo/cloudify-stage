package co.cloudify.rest.client.filters;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import javax.ws.rs.core.MultivaluedMap;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

public class TokenAuthenticatorTest extends FilterTestBase {
    private TokenAuthenticator tokenAuthenticator;

    @BeforeEach
    public void initTest() {
        tokenAuthenticator = new TokenAuthenticator("my_token");
    }

    @Test
    public void testHeader() throws Exception {
        invoke(tokenAuthenticator);
        MultivaluedMap<String, Object> headers = requestContext.getHeaders();
        assertTrue(headers.size() == 1);
        assertEquals(headers.get("Authentication-Token").get(0), "my_token");
    }
}
