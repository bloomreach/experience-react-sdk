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
import axios from 'axios';

const SSO_HANDSHAKE = /(?:^|&)(org.hippoecm.hst.container.render_host=.+?)(?:&|$)/;

const requestConfigGet = {
  method: 'GET',
  withCredentials: true
};

const requestConfigPost = {
  method: 'POST',
  credentials: true,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
};

export function fetchCmsPage(pathInfo, query, preview, cmsUrls) {
  const url = buildApiUrl(pathInfo, query, preview, null, cmsUrls);
  return fetchUrl(url, requestConfigGet);
}

export function fetchComponentUpdate(pathInfo, query, preview, componentId, body) {
  let requestConfig = Object.assign({}, requestConfigPost);
  requestConfig.body = toUrlEncodedFormData(body);
  const url = buildApiUrl(pathInfo, query, preview, componentId);
  return fetchUrl(url, requestConfig);
}

// from rendering.service.js
function toUrlEncodedFormData(json) {
  return Object.keys(json)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(json[key])}`)
    .join('&');
}

export function buildApiUrl(pathInfo, query, preview, componentId, cmsUrls) {
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
  const [, ssoHandshake] = (query && query.match(SSO_HANDSHAKE)) || [];
  if (ssoHandshake) {
    url += (url.indexOf('?') === -1 ? '?' : '') + ssoHandshake;
  }

  return url;
}

function fetchUrl(url, requestConfig) {
  return axios(url, requestConfig)
    .then(response => {
			return response.data;
    }).catch(error => {
			if (error.response) {
				// The request was made and the server responded with a status code
				// that falls out of the range of 2xx
				console.log(`Error! Status code ${response.status} while fetching CMS page data for URL: ${url}`);
				console.log(error.response.data);
				console.log(error.response.headers);
			} else if (error.request) {
				// The request was made but no response was received
				// `error.request` is an instance of XMLHttpRequest in the browser and an instance of
				// http.ClientRequest in node.js
				console.log(error.request);
			} else {
				// Something happened in setting up the request that triggered an Error
				console.log('Error while fetching CMS page data for URL:' + url, error.message);
			}
			console.log(error.config);
    });
}
