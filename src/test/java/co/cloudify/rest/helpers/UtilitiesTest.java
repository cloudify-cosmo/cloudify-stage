package co.cloudify.rest.helpers;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.io.File;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;

import org.apache.commons.io.FileUtils;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class UtilitiesTest {
    private static final Logger logger = LoggerFactory.getLogger(UtilitiesTest.class);

    private static File scratchDir;

    @BeforeAll
    public static void initAll() throws Exception {
        scratchDir = Files.createTempDirectory("test").toFile();
        logger.info("Scratch directory created: {}", scratchDir.getAbsolutePath());
    }

    @AfterAll
    public static void teardownAll() throws Exception {
        logger.info("Deleting scratch directory: {}", scratchDir.getAbsolutePath());
        FileUtils.deleteDirectory(scratchDir);
    }

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
