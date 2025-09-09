// This utility provides secure access to the user's local file system
// using the browser's native, permission-based APIs.

/**
 * Prompts the user to select one or more files.
 * @returns A Promise that resolves with an array of File objects.
 */
export const requestFiles = (): Promise<File[]> => {
    return new Promise((resolve, reject) => {
        const input = document.createElement('input');
        input.type = 'file';
        input.multiple = true;

        input.onchange = (event: Event) => {
            const target = event.target as HTMLInputElement;
            if (target.files) {
                resolve(Array.from(target.files));
            } else {
                reject(new Error("No files selected."));
            }
        };
        
        input.oncancel = () => {
            reject(new Error("File selection was cancelled."));
        };

        input.click();
    });
};

/**
 * Prompts the user to select a directory and reads its text-based file contents.
 * NOTE: This uses a non-standard API that is supported in Chromium-based browsers.
 * @returns A Promise that resolves with an array of strings, each representing a file's path and content.
 */
export const requestDirectory = (): Promise<string[]> => {
    return new Promise((resolve, reject) => {
        const input = document.createElement('input');
        input.type = 'file';
        (input as any).webkitdirectory = true;

        input.onchange = async (event: Event) => {
            const target = event.target as HTMLInputElement;
            const files = target.files;
            if (!files) {
                reject(new Error("No directory selected."));
                return;
            }

            const fileContents: string[] = [];
            for (const file of Array.from(files)) {
                // For this application, we'll focus on text-based files
                if (file.type.startsWith('text/') || file.name.endsWith('.md') || file.name.endsWith('.txt') || file.name.endsWith('.json')) {
                    try {
                        const content = await file.text();
                        fileContents.push(`File: ${(file as any).webkitRelativePath}\nContent:\n${content}`);
                    } catch (e) {
                        console.warn(`Could not read file ${file.name}:`, e);
                    }
                }
            }
            resolve(fileContents);
        };
        
        input.oncancel = () => {
             reject(new Error("Directory selection was cancelled."));
        };

        input.click();
    });
};

/**
 * Converts a File object to a base64 encoded string.
 * @param file The file to convert.
 * @returns A promise that resolves with the base64 string (without the data URL prefix).
 */
export const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const result = reader.result as string;
            // The result is "data:image/png;base64,iVBORw0KGgo..."
            // We need to strip the prefix for the Gemini API
            const base64String = result.split(',')[1];
            resolve(base64String);
        };
        reader.onerror = error => reject(error);
    });
};