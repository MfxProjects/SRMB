const path = require('path');

async function applyWindowsResources(executablePath, iconPath, version) {
  const { rcedit } = await import('rcedit');

  await rcedit(executablePath, {
    'version-string': {
      CompanyName: 'SRMB',
      FileDescription: 'SRMB desktop presentation app',
      InternalName: 'SRMB',
      OriginalFilename: 'SRMB.exe',
      ProductName: 'SRMB',
    },
    'file-version': version,
    'product-version': version,
    icon: iconPath,
  });
}

exports.applyWindowsResources = applyWindowsResources;

exports.default = async function afterPack(context) {
  if (context.electronPlatformName !== 'win32') {
    return;
  }

  const appInfo = context.packager.appInfo;
  const executablePath = path.join(
    context.appOutDir,
    `${appInfo.productFilename}.exe`,
  );
  const iconPath = path.join(context.packager.projectDir, 'build', 'icon.ico');

  await applyWindowsResources(executablePath, iconPath, appInfo.version);
};
