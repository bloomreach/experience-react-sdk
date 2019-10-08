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

import pathToRegexp from 'path-to-regexp';

const defaultCmsUrls = {
  scheme: 'http',
  hostname: 'localhost',
  port: '8080',
  contextPath: 'site',
  channelPath: '',
  previewPrefix: '_cmsinternal',
  apiPath: 'resourceapi',
  apiComponentRenderingUrlSuffix: '?_hn:type=component-rendering&_hn:ref=',
};

function setUrlsWithDefault(urls = {}, defaultUrls = {}) {
  const newUrls = {
    scheme: urls.scheme || defaultUrls.scheme,
    hostname: urls.hostname || defaultUrls.hostname,
    port: urls.port !== undefined ? urls.port : defaultUrls.port,
    contextPath: urls.contextPath !== undefined ? urls.contextPath : defaultUrls.contextPath,
    channelPath: urls.channelPath || defaultUrls.channelPath,
    previewPrefix: urls.previewPrefix !== undefined ? urls.previewPrefix : defaultUrls.previewPrefix,
    apiPath: urls.apiPath || defaultUrls.apiPath,
    apiComponentRenderingUrlSuffix: urls.apiComponentRenderingUrlSuffix || defaultUrls.apiComponentRenderingUrlSuffix,
  };

  newUrls.baseUrl = `${newUrls.scheme}://${newUrls.hostname}`;
  if (newUrls.port) {
    newUrls.baseUrl = `${newUrls.baseUrl}:${newUrls.port}`;
  }

  return newUrls;
}

const cmsUrls = {};

export function updateCmsUrls(urls = {}) {
  if (typeof urls !== 'object') {
    console.log('Warning! Supplied CMS URLs not of type object. Using default URLs.');
    urls = {};
  }

  cmsUrls.live = setUrlsWithDefault(urls.live, defaultCmsUrls);
  cmsUrls.preview = setUrlsWithDefault(urls.preview, cmsUrls.live);

  const pathregexp = `${cmsUrls.live.contextPath !== '' ? `/:contextPath(${cmsUrls.live.contextPath})?` : ''}`
    + `/:previewPrefix(${cmsUrls.live.previewPrefix})?`
    + `${cmsUrls.live.channelPath !== '' ? `/:channelPath(${cmsUrls.live.channelPath})?` : ''}`
    + '/:pathInfo*';

  cmsUrls.regexpKeys = [];
  cmsUrls.regexp = pathToRegexp(pathregexp, cmsUrls.regexpKeys);

  return cmsUrls;
}

export function buildApiUrl(pathInfo, query, preview, componentId, urls) {
  // when using fetch outside of CmsPage for SSR, cmsUrls need to be supplied
  if (!urls) {
    urls = cmsUrls;
  }
  urls = urls[preview ? 'preview' : 'live'];

  let url = urls.baseUrl;
  // add api path to URL, and prefix with contextPath and preview-prefix if used
  if (urls.contextPath !== '') {
    url += `/${urls.contextPath}`;
  }
  if (preview && urls.previewPrefix !== '') {
    url += `/${urls.previewPrefix}`;
  }
  if (urls.channelPath !== '') {
    url += `/${urls.channelPath}`;
  }
  url += `/${urls.apiPath}`;
  if (pathInfo) {
    url += `/${pathInfo}`;
  }
  // if component ID is supplied, URL should be a component rendering URL
  if (componentId) {
    url += urls.apiComponentRenderingUrlSuffix + componentId;
  }
  if (query) {
    url += (url.includes('?') ? '&' : '?') + query;
  }

  return url;
}

function hasPreviewQueryParameter(query) {
  return query.startsWith('bloomreach-preview=true')
    || query.indexOf('&bloomreach-preview=true') !== -1;
}

// if hostname is different for preview and live,
// then hostname can be used to detect if we're in preview mode
function isMatchingPreviewHostname(hostname, urls) {
  return urls.live.hostname !== urls.preview.hostname
    && hostname === urls.preview.hostname;
}

export function parseRequest(request = {}, urls) {
  if (!urls) {
    urls = cmsUrls;
  }

  const [urlPath, query = ''] = request.path.split('?', 2);
  const [hostname] = request.hostname.split(':', 2);
  const results = urls.regexp.exec(urlPath);
  let preview = hasPreviewQueryParameter(query) || isMatchingPreviewHostname(hostname, urls);
  if (!preview && results) {
    const previewIdx = urls.regexpKeys.findIndex((obj) => obj.name === 'previewPrefix');
    preview = results[previewIdx + 1] !== undefined;
  }

  let path = '';
  if (results) {
    const pathIdx = urls.regexpKeys.findIndex((obj) => obj.name === 'pathInfo');
    // query parameter is not needed for fetching API URL and can actually conflict with component rendering URLs
    path = results[pathIdx + 1] || '';
  }

  return { path, preview, query };
}

export function getApiUrl(request, newCmsUrls = {}) {
  // eslint-disable-next-line no-shadow
  const cmsUrls = updateCmsUrls(newCmsUrls);
  const parsedRequest = parseRequest(request, cmsUrls);

  return buildApiUrl(parsedRequest.path, parsedRequest.query, parsedRequest.preview, null, cmsUrls);
}

updateCmsUrls();

export default cmsUrls;
