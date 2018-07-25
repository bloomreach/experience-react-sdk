import setCmsUrls from './cms-urls';

export default function parseUrlPath(urlPath, cmsUrls) {
  if (!cmsUrls) {
    cmsUrls = setCmsUrls;
  }

  // TODO: error handling
  const results = cmsUrls.regexp.exec(urlPath);

  if (results) {
    // find the index of preview and path in keys, so we can look up the corresponding results in the results array
    const pathIdx = cmsUrls.regexpKeys.findIndex(function (obj) {
      return obj.name === 'pathInfo';
    });
    const previewIdx = cmsUrls.regexpKeys.findIndex(function (obj) {
      return obj.name === 'previewPrefix';
    });

    const path = results[pathIdx + 1] !== undefined ? results[pathIdx + 1] : '';
    const preview = results[previewIdx + 1] !== undefined ? true : false;

    return { path: path, preview: preview };
  }
  // TODO: error handling
  return { path: '', preview: false };
}