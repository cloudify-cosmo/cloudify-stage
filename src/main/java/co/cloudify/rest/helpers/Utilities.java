package co.cloudify.rest.helpers;

import java.io.File;
import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URL;

import org.apache.commons.io.FileUtils;
import org.apache.commons.lang3.StringUtils;

public class Utilities {
    /**
     * Given a string that can represent a locally-accessible file or a URL, copy the contents
     * into a file in the specified directory.
     * 
     * It is the caller's responsibility to delete the file after use.
     * 
     * @param location  either a URL or a locally-accessible path
     * @param directory directory to copy the file to
     * 
     * @return A {@link File} instance representing the locally-accessible file
     * 
     * @throws IOException May be thrown if there was a problem reading or writing contents.
     */
    public static File copyFileOrURLToDir(String location, File directory) throws IOException {
        File returnedFile;
        try {
            URL url = new URL(location);
            returnedFile = new File(directory, StringUtils.substringAfterLast(url.getPath(), "/"));
            FileUtils.copyURLToFile(url, returnedFile);
        } catch (MalformedURLException ex) {
            File file = new File(location);
            returnedFile = new File(directory, file.getName());
            FileUtils.copyFile(file, returnedFile);
        }
        return returnedFile;
    }
}
