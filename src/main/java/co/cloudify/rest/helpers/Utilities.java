package co.cloudify.rest.helpers;

import java.io.File;
import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.function.Function;

import org.apache.commons.io.FileUtils;

public class Utilities {
	public static File copyFileOrURLToDir(String location, File directory) throws IOException {
		File returnedFile;
		try {
			URL url = new URL(location);
			returnedFile = new File(directory, url.getFile());
			FileUtils.copyURLToFile(url, returnedFile);
		} catch (MalformedURLException ex) {
			File file = new File(location);
			returnedFile = new File(directory, file.getName());
			FileUtils.copyFile(file, returnedFile);
		}
		return returnedFile;
	}
	
	public static class LocalFileDecorator<R> {
		private Function<File, R> func;
		
		public LocalFileDecorator(String location, Function<File, R> func) {
			super();
			this.func = func;
		}
		
		public R run(String str) throws Exception {
			File tempFile = null;
			File funcFile;
			// Is it a URL?
			try {
				URL url = new URL(str);
				funcFile = tempFile = File.createTempFile("tmp", "tmp");
				FileUtils.copyURLToFile(url, tempFile);
			} catch (MalformedURLException ex) {
				funcFile = new File(str);
			}
			
			R result = func.apply(funcFile);
			
			if (tempFile != null) {
				tempFile.delete();
			}
			
			return result;
		}
	}

}
