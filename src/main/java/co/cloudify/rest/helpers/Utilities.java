package co.cloudify.rest.helpers;

import java.io.File;
import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URL;

import org.apache.commons.io.FileUtils;
import org.apache.commons.lang3.StringUtils;

public class Utilities {
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
