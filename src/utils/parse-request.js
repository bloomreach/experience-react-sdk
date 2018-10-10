import globalCmsUrls from './cms-urls';

export default function parseRequest(request = {}, cmsUrls) {
  if (!cmsUrls) {
    cmsUrls = globalCmsUrls;
  }

  const urlPath = request.path;
  let hostname = request.hostname;
  // remove port number from hostname
  if (hostname.indexOf(':') != -1) {
    hostname = hostname.substring(0, hostname.indexOf(':'));
  }

  // detect if in CMS/preview mode
  let preview = hasPreviewQueryParameter(urlPath);
  if (!preview) {
    preview = isMatchingPreviewHostname(hostname, cmsUrls);
  }
  
  // TODO: error handling
  const results = cmsUrls.regexp.exec(urlPath);

  let path = '';
  if (results) {
    // find the index of preview and path in keys, so we can look up the corresponding results in the results array
    const pathIdx = cmsUrls.regexpKeys.findIndex(function (obj) {
      return obj.name === 'pathInfo';
    });
    const previewIdx = cmsUrls.regexpKeys.findIndex(function (obj) {
      return obj.name === 'previewPrefix';
    });

    path = results[pathIdx + 1] !== undefined ? results[pathIdx + 1] : '';
    
    if (!preview) {
      // otherwise use preview-prefix in URL-path to detect preview mode
      preview = results[previewIdx + 1] !== undefined ? true : false;
    }
  }

  return { path: path, preview: preview };
}

function hasPreviewQueryParameter(urlPath) {
  const queryStringIdx = urlPath.indexOf('?');
  if (queryStringIdx !== -1) {
    const queryString = urlPath.substring(queryStringIdx);
    if (queryString.indexOf('?bloomreach-preview=true') !== -1 || queryString.indexOf('&bloomreach-preview=true') !== -1) {
      return true;
    }
  }
  return false;
}

// if hostname is different for preview and live, 
// then hostname can be used to detect if we're in preview mode
function isMatchingPreviewHostname(hostname, cmsUrls) {
  if (cmsUrls.live.hostname !== cmsUrls.preview.hostname) {
    if (hostname === cmsUrls.preview.hostname) {
      return true;
    } else if (hostname !== cmsUrls.live.hostname) {
      console.log(`Warning! Could not detect preview mode for ${hostname}. Check if cmsUrls have been properly set. Setting preview to false.`);
    }
  }
  return false;
}