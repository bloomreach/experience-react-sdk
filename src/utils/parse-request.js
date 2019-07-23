/*
 * Copyright 2019 Hippo B.V. (http://www.onehippo.com)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import globalCmsUrls from './cms-urls';

function hasPreviewQueryParameter(urlPath) {
  const queryStringIdx = urlPath.indexOf('?');
  if (queryStringIdx === -1) {
    return false;
  }

  const queryString = urlPath.substring(queryStringIdx);

  return queryString.includes('?bloomreach-preview=true')
    || queryString.includes('&bloomreach-preview=true');
}

function removeQueryParameter(urlPath) {
  const queryStringIdx = urlPath.indexOf('?');
  if (queryStringIdx !== -1) {
    return urlPath.substring(0, queryStringIdx);
  }
  return urlPath;
}

// if hostname is different for preview and live,
// then hostname can be used to detect if we're in preview mode
function isMatchingPreviewHostname(hostname, cmsUrls) {
  if (cmsUrls.live.hostname !== cmsUrls.preview.hostname) {
    if (hostname === cmsUrls.preview.hostname) {
      return true;
    }
  }
  return false;
}

export default function parseRequest(request = {}, cmsUrls) {
  if (!cmsUrls) {
    cmsUrls = globalCmsUrls;
  }

  const urlPath = request.path;
  let { hostname } = request;
  // remove port number from hostname

  const idxOfColon = hostname.indexOf(':');
  if (idxOfColon !== -1) {
    hostname = hostname.substring(0, idxOfColon);
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
    const pathIdx = cmsUrls.regexpKeys.findIndex(obj => obj.name === 'pathInfo');
    const previewIdx = cmsUrls.regexpKeys.findIndex(obj => obj.name === 'previewPrefix');

    path = results[pathIdx + 1] !== undefined ? results[pathIdx + 1] : '';
    // query parameter is not needed for fetching API URL and can actually conflict with component rendering URLs
    path = removeQueryParameter(path);

    if (!preview) {
      // otherwise use preview-prefix in URL-path to detect preview mode
      preview = results[previewIdx + 1] !== undefined;
    }
  }

  return {
    path,
    preview,
    query: urlPath.split('?', 2)[1] || '',
  };
}
