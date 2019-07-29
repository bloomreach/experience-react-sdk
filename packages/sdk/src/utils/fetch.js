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

import axios from 'axios';
import { buildApiUrl } from './cms-urls';

const requestConfigGet = {
  method: 'GET',
  withCredentials: true,
};

const requestConfigPost = {
  method: 'POST',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
};

async function fetchUrl(url, requestConfig) {
  try {
    const { data } = await axios(url, requestConfig);

    return data;
  } catch (error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.log(`Error! Status code ${error.response.status} while fetching CMS page data for URL: ${url}`);
      console.log(error.response.data);
      console.log(error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      console.log(error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.log(`Error while fetching CMS page data for URL:${url}`, error.message);
    }

    console.log(error.config);
  }

  return null;
}

export function fetchCmsPage(pathInfo, query, preview, cmsUrls) {
  const url = buildApiUrl(pathInfo, query, preview, null, cmsUrls);
  return fetchUrl(url, requestConfigGet);
}

// from rendering.service.js
function toUrlEncodedFormData(json) {
  return Object.keys(json)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(json[key])}`)
    .join('&');
}

export function fetchComponentUpdate(pathInfo, query, preview, componentId, body) {
  const requestConfig = Object.assign({ data: toUrlEncodedFormData(body) }, requestConfigPost);
  const url = buildApiUrl(pathInfo, query, preview, componentId);

  return fetchUrl(url, requestConfig);
}
