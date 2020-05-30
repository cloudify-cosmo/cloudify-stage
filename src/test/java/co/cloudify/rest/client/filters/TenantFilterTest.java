package co.cloudify.rest.client.filters;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import javax.ws.rs.core.MultivaluedMap;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

public class TenantFilterTest extends FilterTestBase {
    private TenantFilter tenantFilter;

    @BeforeEach
    public void initTest() {
        tenantFilter = new TenantFilter("my_tenant");
    }

    @Test
    public void testBlankFields() throws Exception {
        assertThrows(NullPointerException.class, () -> new TenantFilter(null));
        assertThrows(IllegalArgumentException.class, () -> new TenantFilter("    "));
    }

    @Test
    public void testHeader() throws Exception {
        invoke(tenantFilter);
        MultivaluedMap<String, Object> headers = requestContext.getHeaders();
        assertTrue(headers.size() == 1);
        assertEquals(headers.get("Tenant").get(0), "my_tenant");
    }
}
