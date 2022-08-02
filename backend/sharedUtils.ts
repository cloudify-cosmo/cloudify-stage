export function isYamlFile(filename: string) {
    const lowercaseFilename = filename.toLowerCase();
    return lowercaseFilename.endsWith('.yaml') || lowercaseFilename.endsWith('.yml');
}
