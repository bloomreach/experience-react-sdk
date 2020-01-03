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

import jsonpointer from 'jsonpointer';
import globalCmsUrls, { FULLY_QUALIFIED_LINK } from './cms-urls';
import getNestedObject from './get-nested-object';

export function getImageUrl(imageRef, pageModel, preview, variant) {
  // get image reference
  let imageUuid;
  if (imageRef && imageRef.$ref) {
    imageUuid = imageRef.$ref;
  }

  // get serialized image via reference
  let image;
  if (imageUuid && (typeof imageUuid === 'string' || imageUuid instanceof String)) {
    image = jsonpointer.get(pageModel, imageUuid);
  }

  // build URL
  let imageUrl = variant && getNestedObject(image, [variant])
    ? getNestedObject(image, [variant, '_links', 'site', 'href'])
    : getNestedObject(image, ['_links', 'site', 'href']);

  if (imageUrl && !imageUrl.match(FULLY_QUALIFIED_LINK)) {
    imageUrl = globalCmsUrls[preview ? 'preview' : 'live'].baseUrl + imageUrl;
  }

  return imageUrl;
}

export function getImageUrlByPath(imagePath, variant, preview) {
  const cmsUrls = globalCmsUrls[preview ? 'preview' : 'live'];

  let imageUrl = cmsUrls.baseUrl;

  if (cmsUrls.contextPath) {
    imageUrl += `/${cmsUrls.contextPath}`;
  }

  imageUrl += '/binaries';

  if (variant) {
    imageUrl += `/${variant}`;
  }

  imageUrl += imagePath;

  return imageUrl;
}
