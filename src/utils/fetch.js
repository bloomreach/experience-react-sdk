import globalCmsUrls from './cms-urls';

const requestConfigGet = {
  method: 'GET',
  credentials: 'include'
};

const requestConfigPost = {
  method: 'POST',
  credentials: 'include',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
};

export function fetchCmsPage(pathInfo, preview, cmsUrls) {
  const url = buildApiUrl(pathInfo, preview, null, cmsUrls);
  return fetchUrl(url, requestConfigGet);
}

export function fetchComponentUpdate(pathInfo, preview, componentId, body) {
  let requestConfig = Object.assign({}, requestConfigPost);
  requestConfig.body = toUrlEncodedFormData(body);
  const url = buildApiUrl(pathInfo, preview, componentId);
  return fetchUrl(url, requestConfig);
}

// from rendering.service.js
function toUrlEncodedFormData(json) {
  return Object.keys(json)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(json[key])}`)
    .join('&');
}

export function buildApiUrl(pathInfo, preview, componentId, cmsUrls) {
  // when using fetch outside of CmsPage for SSR, cmsUrls need to be supplied
  if (!cmsUrls) {
    cmsUrls = globalCmsUrls;
  }
  // use either preview or live URLs
  if (preview) {
    cmsUrls = cmsUrls.preview;
  } else {
    cmsUrls = cmsUrls.live;
  }
  let url = cmsUrls.baseUrl;
  // add api path to URL, and prefix with contextPath and preview-prefix if used
  if (cmsUrls.contextPath !== '') {
    url += '/' + cmsUrls.contextPath;
  }
  if (preview && cmsUrls.previewPrefix !== '') {
    url += '/' + cmsUrls.previewPrefix;
  }
  if (cmsUrls.channelPath !== '') {
    url += '/' + cmsUrls.channelPath;
  }
  url += '/' + cmsUrls.apiPath;
  if (pathInfo) {
    url += '/' + pathInfo;
  }
  // if component ID is supplied, URL should be a component rendering URL
  if (componentId) {
    url += cmsUrls.apiComponentRenderingUrlSuffix + componentId;
  }
  return url;
}

function fetchUrl(url, requestConfig) {
  return window.fetch(url, requestConfig)
    .then(response => {
      if (response.ok) {
        try {
          return response.json();
        } catch (err) {
          console.log(`Error! Could not convert response to JSON for URL: ${url}`);
          console.log(err);
          return null;
        }
      } else {
        console.log(`Error! Status code ${response.status} while fetching CMS page data for URL: ${url}`)
      }
    }).catch(error => {
      console.log('Error while fetching CMS page data for URL:', url);
      console.log(error);
    });
}
