/**
 * @file
 * Contains utility functions shared across backend and frontend.
 * This file is not supposed to reference any node-specific APIs.
 */

export function isYamlFile(filename: string) {
    const lowercaseFilename = filename.toLowerCase();
    return lowercaseFilename.endsWith('.yaml') || lowercaseFilename.endsWith('.yml');
}
