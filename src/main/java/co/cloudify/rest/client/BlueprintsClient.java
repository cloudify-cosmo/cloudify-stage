package co.cloudify.rest.client;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.nio.file.FileVisitResult;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.SimpleFileVisitor;
import java.nio.file.attribute.BasicFileAttributes;
import java.util.Collections;

import javax.ws.rs.NotFoundException;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.client.Client;
import javax.ws.rs.client.Entity;
import javax.ws.rs.client.Invocation.Builder;
import javax.ws.rs.client.WebTarget;
import javax.ws.rs.core.GenericType;
import javax.ws.rs.core.MediaType;

import org.apache.commons.compress.archivers.ArchiveEntry;
import org.apache.commons.compress.archivers.tar.TarArchiveOutputStream;
import org.apache.commons.compress.compressors.gzip.GzipCompressorOutputStream;
import org.apache.commons.io.FileUtils;
import org.apache.commons.lang3.StringUtils;

import co.cloudify.rest.client.exceptions.BlueprintNotFoundException;
import co.cloudify.rest.client.exceptions.CloudifyClientException;
import co.cloudify.rest.model.Blueprint;
import co.cloudify.rest.model.ListResponse;

/**
 * REST client for blueprint-related operations.
 * 
 * @author Isaac Shabtay
 */
public class BlueprintsClient extends AbstractCloudifyClient {
    /** Base API path. */
    private static final String BASE_PATH = "/api/v3.1/blueprints";
    /** Path for specific resource. */
    private static final String ID_PATH = BASE_PATH + "/{id}";

    /** Allowable sort keys. */
    public static final String[] SORT_KEYS = { "id", "created_at", "main_file_name", "description", "tenant_name",
            "updated_at", "created_by", "private_resource", "resource_availability", "visibility", "is_hidden" };

    public BlueprintsClient(Client restClient, WebTarget base) {
        super(restClient, base);
    }

    protected WebTarget getBlueprintTarget(final String id) {
        return getTarget(ID_PATH, Collections.singletonMap("id", id));
    }

    protected Builder getBuilder(final String id) {
        return getBuilder(getBlueprintTarget(id));
    }

    /**
     * Get a blueprint by ID.
     * 
     * @param id ID of blueprint to get
     * 
     * @return A {@link Blueprint} instance for that blueprint.
     */
    public Blueprint get(final String id) {
        try {
            return getBuilder(id).get(Blueprint.class);
        } catch (NotFoundException ex) {
            throw new BlueprintNotFoundException(id, ex);
        } catch (WebApplicationException ex) {
            throw CloudifyClientException.create("Failed retrieving blueprint", ex);
        }
    }

    /**
     * Uploads a blueprint archive.
     * 
     * @param id      blueprint ID
     * @param archive archive file
     * @param main    main YAML filename
     * 
     * @return A {@link Blueprint} instance for the uploaded blueprint.
     * 
     * @throws IOException I/O issue encountered while reading archive.
     */
    public Blueprint uploadArchive(final String id, final File archive, final String main) throws IOException {
        Builder builder = getBuilder(
                getBlueprintTarget(id)
                        .queryParam("application_file_name", main));
        try (InputStream is = new FileInputStream(archive)) {
            try {
                return builder.put(
                        Entity.entity(
                                is, MediaType.APPLICATION_OCTET_STREAM),
                        Blueprint.class);
            } catch (WebApplicationException ex) {
                throw CloudifyClientException.create("Failed uploading blueprint", ex);
            }
        }
    }

    /**
     * Uploads a blueprint from the URL. This command doesn't download the URL
     * contents locally. The specified URL must be accessible from within Cloudify
     * Manager.
     * 
     * @param id         blueprint ID
     * @param archiveUrl URL to archive
     * @param main       main YAML filename
     * 
     * @return A {@link Blueprint} instance for the uploaded blueprint
     */
    public Blueprint upload(final String id, final URL archiveUrl, final String main) {
        try {
            return getBuilder(
                    getBlueprintTarget(id)
                            .queryParam("blueprint_archive_url", archiveUrl.toString()))
                                    .put(null, Blueprint.class);
        } catch (WebApplicationException ex) {
            throw CloudifyClientException.create("Failed uploading blueprint", ex);
        }
    }

    /**
     * Uploads a blueprint from a local directory.
     * 
     * @param id            blueprint ID
     * @param rootDirectory root directory of the blueprint
     * @param main          main YAML filename
     * 
     * @return A {@link Blueprint} instance for the uploaded blueprint
     * 
     * @throws IOException A problem occured while creating the blueprint archive.
     */
    public Blueprint upload(final String id, final File rootDirectory, final String main) throws IOException {
        // Archive the entire directory into a temporary file.
        File tempFile = File.createTempFile("blueprint", ".tar.gz");
        try {
            try (TarArchiveOutputStream taos = new TarArchiveOutputStream(
                    new GzipCompressorOutputStream(new FileOutputStream(tempFile)))) {
                taos.setLongFileMode(TarArchiveOutputStream.LONGFILE_GNU);
                Path rootPath = rootDirectory.toPath();

                // Work around the fact that lambda expressions can't throw checked exceptions.
                // Wrap IOException with RuntimeException, and when catching a runtime
                // exception,
                // re-throw the wrapped exception if it's an IOException.
                try {
                    Files.walkFileTree(rootPath, new SimpleFileVisitor<Path>() {
                        @Override
                        public FileVisitResult visitFile(Path file, BasicFileAttributes attrs) throws IOException {
                            super.visitFile(file, attrs);
                            ArchiveEntry entry = taos.createArchiveEntry(file.toFile(),
                                    String.format("blueprint/%s", rootPath.relativize(file)));
                            taos.putArchiveEntry(entry);
                            if (file.toFile().isFile()) {
                                FileUtils.copyFile(file.toFile(), taos);
                            }
                            taos.closeArchiveEntry();
                            return FileVisitResult.CONTINUE;
                        }
                    });
                } catch (RuntimeException ex) {
                    if (ex.getCause() instanceof IOException) {
                        throw (IOException) ex.getCause();
                    }
                    throw ex;
                }
            }
            return uploadArchive(id, tempFile, main);
        } finally {
            tempFile.delete();
        }
    }

    /**
     * Deletes a blueprint.
     * 
     * @param id ID of blueprint to delete
     */
    public void delete(final String id) {
        try {
            getBuilder(id).delete();
        } catch (NotFoundException ex) {
            throw new BlueprintNotFoundException(id, ex);
        } catch (WebApplicationException ex) {
            throw CloudifyClientException.create("Failed deleting blueprint", ex);
        }
    }

    /**
     * @return A list of all blueprints.
     */
    public ListResponse<Blueprint> list() {
        return list(null);
    }

    /**
     * Returns a list of all blueprints with ID's containing a string.
     * 
     * @param searchString string to search for
     * 
     * @return A list of matching blueprints.
     */
    public ListResponse<Blueprint> list(final String searchString) {
        return list(searchString, null, false);
    }

    /**
     * Returns a list of all blueprints with ID's containing a string.
     * 
     * @param searchString string to search for
     * @param sortKey      key to sort by
     * @param descending   <code>true</code> for a descending sorting order
     * 
     * @return A list of matching blueprints.
     */
    public ListResponse<Blueprint> list(final String searchString, final String sortKey, final boolean descending) {
        WebTarget target = getTarget(BASE_PATH);
        if (StringUtils.isNotBlank(searchString)) {
            target = target.queryParam("_search", searchString);
        }
        if (StringUtils.isNotBlank(sortKey)) {
            target = target.queryParam("_sort", String.format("%s%s",
                    descending ? "-" : StringUtils.EMPTY, sortKey));
        }
        try {
            return getBuilder(target).get(new GenericType<ListResponse<Blueprint>>() {});
        } catch (WebApplicationException ex) {
            throw CloudifyClientException.create("Failed listing blueprints", ex);
        }
    }
}
