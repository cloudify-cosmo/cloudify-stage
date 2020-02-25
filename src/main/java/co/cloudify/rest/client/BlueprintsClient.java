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
import org.apache.commons.lang3.Validate;

import co.cloudify.rest.client.exceptions.BlueprintNotFoundException;
import co.cloudify.rest.model.Blueprint;
import co.cloudify.rest.model.ListResponse;

public class BlueprintsClient extends AbstractCloudifyClient {
	/**	Base API path. */
	private static final String BASE_PATH = "/api/v3.1/blueprints";
	/**	Path for specific resource. */
	private static final String ID_PATH = BASE_PATH + "/{id}";

	public BlueprintsClient(Client restClient, WebTarget base) {
		super(restClient, base);
	}
	
	protected Builder getBlueprintsBuilder(final String ... args) {
		Validate.isTrue(args.length <= 1);
		return getBuilder(getTarget(args.length == 1 ? ID_PATH : BASE_PATH, args.length == 1 ? Collections.singletonMap("id", args[0]) : Collections.emptyMap()));
	}
	
	/**
	 * Get a blueprint by ID.
	 * 
	 * @param	id	ID of blueprint to get
	 * 
	 * @return	A {@link Blueprint} instance for that blueprint.
	 */
	public Blueprint get(final String id) {
		return getBlueprintsBuilder(id).get(Blueprint.class);
	}

	public Blueprint uploadArchive(final String id, final File blueprintArchive, final String main) throws IOException {
		WebTarget target = getTarget(ID_PATH, Collections.singletonMap("id", id));
		target = target.queryParam("application_file_name", main);
		Builder builder = getBuilder(target);
		try (InputStream is = new FileInputStream(blueprintArchive)) {
			return builder.put(Entity.entity(is, MediaType.APPLICATION_OCTET_STREAM), Blueprint.class);
		}
	}
	
	public Blueprint upload(final String id, final URL archiveUrl, final String main) {
		WebTarget target = getTarget(ID_PATH, Collections.singletonMap("id", id));
		target = target.queryParam("blueprint_archive_url", archiveUrl.toString());
		return getBuilder(target).put(null, Blueprint.class);
	}
	
	public Blueprint upload(final String id, final File rootDirectory, final String main) throws IOException {
		//	Archive the entire directory into a temporary file.
		File tempFile = File.createTempFile("blueprint", ".tar.gz");
		try {
			try (TarArchiveOutputStream taos = new TarArchiveOutputStream(new GzipCompressorOutputStream(new FileOutputStream(tempFile)))) {
				taos.setLongFileMode(TarArchiveOutputStream.LONGFILE_GNU);
				Path rootPath = rootDirectory.toPath();
				
				//	Work around the fact that lambda expressions can't throw checked exceptions.
				//	Wrap IOException with RuntimeException, and when catching a runtime exception,
				//	re-throw the wrapped exception if it's an IOException.
				try {
					Files.walkFileTree(rootPath, new SimpleFileVisitor<Path>() {
						@Override
					    public FileVisitResult visitFile(Path file, BasicFileAttributes attrs) throws IOException {
					    	super.visitFile(file, attrs);
							ArchiveEntry entry = taos.createArchiveEntry(file.toFile(), String.format("blueprint/%s", rootPath.relativize(file)));
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
	 * @param	id	ID of blueprint to delete
	 */
	public void delete(final String id) {
		try {
			getBlueprintsBuilder(id).delete();
		} catch (NotFoundException ex) {
			throw new BlueprintNotFoundException(id, ex);
		}
	}
	
	/**
	 * @return	A list of all blueprints.
	 */
	public ListResponse<Blueprint> list() {
		return list(null);
	}

	public ListResponse<Blueprint> list(final String searchString) {
		WebTarget target = getTarget(BASE_PATH);
		if (StringUtils.isNotBlank(searchString)) {
			target = target.queryParam("_search", searchString);
		};
		return getBuilder(target).get(new GenericType<ListResponse<Blueprint>>() {});
	}
}
