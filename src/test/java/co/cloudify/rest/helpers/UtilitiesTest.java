package co.cloudify.rest.helpers;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.io.File;
import java.nio.charset.StandardCharsets;

import org.apache.commons.io.FileUtils;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;

public class UtilitiesTest {
    @TempDir
    public static File scratchDir;

    @Test
    public void testCopyFile() throws Exception {
        File sourceFile = new File(scratchDir, "test.txt");
        FileUtils.write(sourceFile, "hello", StandardCharsets.UTF_8);
        File targetDir = new File(scratchDir, "targetForTestCopy");
        targetDir.mkdir();
        Utilities.copyFileOrURLToDir(sourceFile.getAbsolutePath(), targetDir);
        File expectedTargetFile = new File(targetDir, "test.txt");
        assertTrue(expectedTargetFile.exists());
        assertTrue(expectedTargetFile.isFile());
        String copiedContents = FileUtils.readFileToString(expectedTargetFile, StandardCharsets.UTF_8);
        assertEquals("hello", copiedContents);
    }
}
