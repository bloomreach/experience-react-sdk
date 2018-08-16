import globalCmsUrls from './cms-urls';

export default function parseRequest(request = {}, cmsUrls) {
  if (!cmsUrls) {
    cmsUrls = globalCmsUrls;
  }

  const urlPath = request.path;
  let hostName = request.hostName;
  // remove port number from host name
  if (hostName.indexOf(':') != -1) {
    hostName = hostName.substring(0, hostName.indexOf(':'));
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

    // if hostname is different for preview and live, 
    // then hostname can be used to detect if we're in preview mode
    let preview;
    if (cmsUrls.live.baseUrl !== cmsUrls.preview.baseUrl) {
      if (hostName === cmsUrls.live.hostName) {
        preview = false;
      } else if (hostName === cmsUrls.preview.hostName) {
        preview = true;
      } else {
        preview = false;
        console.log(`Warning! Could not detect preview mode for ${hostName}. Check if cmsUrls have been properly set. Setting preview to false.`);
      }
    } else {
      // otherwise use preview-prefix in URL-path to detect preview mode
      preview = results[previewIdx + 1] !== undefined ? true : false;
    }

    return { path: path, preview: preview };
  }
  // TODO: error handling
  return { path: '', preview: false };
}