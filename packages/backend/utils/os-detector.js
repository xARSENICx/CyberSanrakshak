import os from 'os';

export const getOperatingSystem = () => {
    const platform = os.platform();
    switch (platform) {
        case 'win32':
            return 'windows';
        case 'linux':
            return 'linux';
        case 'darwin':
            return 'macos';
        default:
            return 'unknown';
    }
};

export const isWindows = () => getOperatingSystem() === 'windows';
export const isLinux = () => getOperatingSystem() === 'linux';
export const isMacOS = () => getOperatingSystem() === 'macos';