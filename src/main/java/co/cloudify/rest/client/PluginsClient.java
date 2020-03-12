package co.cloudify.rest.client;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.nio.file.Files;
import java.util.Arrays;

import javax.ws.rs.WebApplicationException;
import javax.ws.rs.client.Client;
import javax.ws.rs.client.Entity;
import javax.ws.rs.client.Invocation.Builder;
import javax.ws.rs.client.WebTarget;
import javax.ws.rs.core.MediaType;

import org.apache.commons.compress.archivers.ArchiveEntry;
import org.apache.commons.compress.archivers.zip.ZipArchiveOutputStream;
import org.apache.commons.io.FileUtils;

import co.cloudify.rest.client.exceptions.CloudifyClientException;
import co.cloudify.rest.helpers.Utilities;
import co.cloudify.rest.model.Plugin;

/**
 * <p>
 * Client for plugin-related operations.
 * </p>
 * <p>
 * <b>NOTE:</b>As of Cloudify 5.0.5, plugin operations at the REST client level
 * are asynchronous. The only way to know whether plugin installation ended, is
 * by looking for executions of the "install_plugin" system workflow, and
 * comparing the execution parameters. See
 * <a href="https://cloudifysource.atlassian.net/browse/CYBL-939">CYBL-939</a>
 * for more information.
 * </p>
 * 
 * @author Isaac Shabtay
 */
public class PluginsClient extends AbstractCloudifyClient {
    /** Base API path. */
    private static final String BASE_PATH = "/api/v3.1/plugins";

    public PluginsClient(Client restClient, WebTarget base) {
        super(restClient, base);
    }

    protected WebTarget getPluginsTarget() {
        return getTarget(BASE_PATH);
    }

    protected Builder getPluginsBuilder() {
        return getBuilder(getPluginsTarget());
    }

    /**
     * Uploads a plugin archive from a URL. The archive must include the Wagon file
     * and the <code>plugin.yaml</code> file.
     * 
     * @param archiveUrl URL to archive
     * 
     * @return A {@link Plugin} instance for the new plugin.
     */
    public Plugin upload(final URL archiveUrl) {
        try {
            return getBuilder(
                    getPluginsTarget().queryParam(
                            "plugin_archive_url", archiveUrl.toString())).post(null, Plugin.class);
        } catch (WebApplicationException ex) {
            throw CloudifyClientException.create("Failed uploading plugin", ex);
        }
    }

    /**
     * Uploads a plugin.
     * 
     * @param wagonLocation path or URL to Wagon
     * @param yamlLocation  path or URL to <code>plugin.yaml</code> file
     * 
     * @return A {@link Plugin} instance for the new plugin
     * 
     * @throws IOException Failed reading the wagon or the <code>plugin.yaml</code>
     *                     file.
     */
    public Plugin upload(final String wagonLocation, final String yamlLocation) throws IOException {
        File tempDir = Files.createTempDirectory("plugin").toFile();
        File tempZip = null;
        try {
            File wagonFile = Utilities.copyFileOrURLToDir(wagonLocation, tempDir);
            File yamlFile = Utilities.copyFileOrURLToDir(yamlLocation, tempDir);
            tempZip = File.createTempFile("plugin", ".zip");
            try (ZipArchiveOutputStream zaos = new ZipArchiveOutputStream(tempZip)) {
                for (File f : Arrays.asList(wagonFile, yamlFile)) {
                    ArchiveEntry entry = zaos.createArchiveEntry(f, f.getName());
                    zaos.putArchiveEntry(entry);
                    FileUtils.copyFile(f, zaos);
                    zaos.closeArchiveEntry();
                }
            }

            try (InputStream is = new FileInputStream(tempZip)) {
                try {
                    return getPluginsBuilder().post(Entity.entity(is, MediaType.APPLICATION_OCTET_STREAM),
                            Plugin.class);
                } catch (WebApplicationException ex) {
                    throw CloudifyClientException.create("Failed uploading plugin", ex);
                }
            }
        } finally {
            FileUtils.deleteDirectory(tempDir);
            if (tempZip != null) {
                tempZip.delete();
            }
        }
    }
}
