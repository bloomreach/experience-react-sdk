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
  apiComponentRenderingUrlSuffix: '?_hn:type=component-rendering&_hn:ref='
}

const cmsUrls = {};
updateCmsUrls();
export default cmsUrls;

export function updateCmsUrls(urls = {}) {
  if (typeof urls !== 'object') {
    console.log('Warning! Supplied CMS URLs not of type object. Using default URLs.')
    urls = {};
  }

  cmsUrls.live = setUrlsWithDefault(urls.live, defaultCmsUrls);
  cmsUrls.preview = setUrlsWithDefault(urls.preview, cmsUrls.live);

  const pathregexp = (cmsUrls.live.contextPath !== '' ? `/:contextPath(${cmsUrls.live.contextPath})?` : '') +
    `/:previewPrefix(${cmsUrls.live.previewPrefix})?` +
    (cmsUrls.live.channelPath !== '' ? `/:channelPath(${cmsUrls.live.channelPath})?` : '') +
    '/:pathInfo*';

  cmsUrls.regexpKeys = [];
  cmsUrls.regexp = pathToRegexp(pathregexp, cmsUrls.regexpKeys);

  return cmsUrls;
}

function setUrlsWithDefault(urls = {}, defaultUrls = {}) {
  const newUrls = {};
  newUrls.scheme = urls.scheme ? urls.scheme : defaultUrls.scheme;
  newUrls.hostname = urls.hostname ? urls.hostname : defaultUrls.hostname;
  newUrls.port = urls.port !== undefined ? urls.port : defaultUrls.port;
  newUrls.baseUrl = `${newUrls.scheme}://${newUrls.hostname}`;
  if (newUrls.port) {
    newUrls.baseUrl = `${newUrls.baseUrl}:${newUrls.port}`;
  }
  newUrls.contextPath = urls.contextPath !== undefined ? urls.contextPath : defaultUrls.contextPath;
  newUrls.channelPath = urls.channelPath ? urls.channelPath : defaultUrls.channelPath;
  newUrls.previewPrefix = urls.previewPrefix !== undefined ? urls.previewPrefix : defaultUrls.previewPrefix;
  newUrls.apiPath = urls.apiPath ? urls.apiPath : defaultUrls.apiPath;
  newUrls.apiComponentRenderingUrlSuffix = urls.apiComponentRenderingUrlSuffix ? urls.apiComponentRenderingUrlSuffix : defaultUrls.apiComponentRenderingUrlSuffix;
  return newUrls;
}
