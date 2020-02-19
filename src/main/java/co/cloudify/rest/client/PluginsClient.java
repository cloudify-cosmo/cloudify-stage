package co.cloudify.rest.client;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.nio.file.Files;
import java.util.Arrays;

import javax.ws.rs.BadRequestException;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.client.Client;
import javax.ws.rs.client.Entity;
import javax.ws.rs.client.WebTarget;
import javax.ws.rs.core.MediaType;

import org.apache.commons.compress.archivers.ArchiveEntry;
import org.apache.commons.compress.archivers.zip.ZipArchiveOutputStream;
import org.apache.commons.io.FileUtils;

import co.cloudify.rest.client.exceptions.CloudifyClientException;
import co.cloudify.rest.helpers.Utilities;
import co.cloudify.rest.model.Plugin;

public class PluginsClient extends AbstractCloudifyClient {
	/**	Base API path. */
	private static final String BASE_PATH = "/api/v3.1/plugins";
	
	public PluginsClient(Client restClient, WebTarget base) {
		super(restClient, base);
	}
	
	public Plugin upload(final URL archiveUrl) throws IOException {
		try {
			return getBuilder(
					getTarget(BASE_PATH).queryParam("plugin_archive_url", archiveUrl.toString())
					).post(null, Plugin.class);
		} catch (WebApplicationException ex) {
			throw CloudifyClientException.create("Failed uploading plugin", ex);
		}
	}
	
	public Plugin upload(final String wagonLocation, final String yamlLocation) throws IOException {
		File tempDir = Files.createTempDirectory("plugin").toFile();
		File tempZip = null;
		try {
			File wagonFile = Utilities.copyFileOrURLToDir(wagonLocation, tempDir);
			File yamlFile = Utilities.copyFileOrURLToDir(yamlLocation, tempDir);
			tempZip = File.createTempFile("plugin", ".zip");
			try (ZipArchiveOutputStream zaos = new ZipArchiveOutputStream(tempZip)) {
				for (File f: Arrays.asList(wagonFile, yamlFile)) {
					ArchiveEntry entry = zaos.createArchiveEntry(f, f.getName());
					zaos.putArchiveEntry(entry);
					FileUtils.copyFile(f, zaos);
					zaos.closeArchiveEntry();
				}
			}
	
			try (InputStream is = new FileInputStream(tempZip)) {
				try {
					return getBuilder(getTarget(BASE_PATH)).post(Entity.entity(is, MediaType.APPLICATION_OCTET_STREAM), Plugin.class);
				} catch (BadRequestException ex) {
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
