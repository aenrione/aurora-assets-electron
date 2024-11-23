export async function minimizeWindow() {
    await window.electronWindow.minimize();
}
export async function maximizeWindow() {
    await window.electronWindow.maximize();
}
export async function closeWindow() {
    await window.electronWindow.close();
}

// FTP
export async function connect(ip: string, user: string, pass: string, port: string) {
    return await window.electronWindow.connect(ip, user, pass, port);
}

export async function saveFtpSettings(ip: string, user: string, pass: string, port: string) {
    return await window.electronWindow.saveSettings(ip, user, pass, port);
}

export async function getFtpSettings() {
    return await window.electronWindow.getSettings();
}

export function onFtpStatus(func: (...args: unknown[]) => void) {
    return window.electronWindow.on('ftp-status', func);
}

export async function getAssetList() {
    return await window.electronWindow.getAssetList();
}

export async function getAssetData(asset: any) {
    return await window.electronWindow.getAssetData(asset);
}
