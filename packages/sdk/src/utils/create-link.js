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

import React from 'react';
import jsonpointer from 'jsonpointer';
import getNestedObject from './get-nested-object';
import { CreateLinkContext, PageModelContext } from '../context';

function isString(value) {
  return typeof value === 'string' || value instanceof String;
}

function _createLink(linkType, link, linkText, className, externalCreateLinkFunction, pageModel) {
  let href = null;
  let internalLink = null;

  // eslint-disable-next-line default-case
  switch (linkType) {
    case 'self':
      href = getNestedObject(link, ['_links', 'site', 'href']);
      internalLink = getNestedObject(link, ['_links', 'site', 'type']);
      break;

    case 'ref':
      if (!link || !isString(link)) {
        break;
      }
      // eslint-disable-next-line no-case-declarations
      const linkedContent = jsonpointer.get(pageModel, link);
      if (linkedContent) {
        href = getNestedObject(linkedContent, ['_links', 'site', 'href']);
        internalLink = getNestedObject(linkedContent, ['_links', 'site', 'type']);
      }
      break;

    case 'href':
      href = link;
      internalLink = 'internal';
      break;
  }

  // linkText is a function insteaf of a string, so that additional HTML can be included inside the anchor tag
  if (href && internalLink && typeof linkText === 'function') {
    return internalLink === 'internal' && typeof externalCreateLinkFunction === 'function'
      ? externalCreateLinkFunction(href, linkText, className)
      : <a className={className} href={href}>{linkText()}</a>;
  }

  return null;
}

export default function createLink(linkType, link, linkText, className) {
  return (
    <PageModelContext.Consumer>
      { (pageModel) => <CreateLinkContext.Consumer>
          { (externalCreateLinkFunction) => _createLink(
            linkType,
            link,
            linkText,
            className,
            externalCreateLinkFunction,
            pageModel,
          ) }
      </CreateLinkContext.Consumer> }
    </PageModelContext.Consumer>
  );
}
