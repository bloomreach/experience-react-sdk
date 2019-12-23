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
import ReactHtmlParser from 'react-html-parser';
import globalCmsUrls from './cms-urls';
import createLink from './create-link';

const FULLY_QUALIFIED_LINK = /\w+:\/\//;

function getChildren(node) {
  if (!node.children) {
    return '';
  }

  return node.children.reduce(
    (linkText, childNode) => linkText
      + getChildren(childNode)
      + (childNode.type === 'text' ? childNode.data : ''),
    '',
  );
}

export default function parseAndRewriteLinks(html, preview) {
  return ReactHtmlParser(html, {
    // eslint-disable-next-line consistent-return
    transform: (node) => {
      if (node.type === 'tag' && node.name === 'a' && node.attribs['data-type']
        && node.attribs['data-type'] === 'internal') {
        const { class: className, href } = node.attribs;
        const linkText = () => getChildren(node);
        const link = createLink('href', href, linkText, className);

        return React.cloneElement(link, { key: node.parent ? node.parent.children.indexOf(node) : 0 });
      }
      if (
        node.type === 'tag'
        && node.name === 'img'
        && node.attribs.src
        && !node.attribs.src.match(FULLY_QUALIFIED_LINK)
      ) {
        // transform image URLs in fully qualified URLs, so images are also loaded when requested from React app
        // which typically runs on a different port than CMS / HST
        const baseCmsUrl = globalCmsUrls[preview ? 'preview' : 'live'].baseUrl;
        node.attribs.src = baseCmsUrl + node.attribs.src;
      }
    },
  });
}
