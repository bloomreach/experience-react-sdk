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

export default function parseAndRewriteLinks (html, preview) {
  return ReactHtmlParser(html, {
    transform: (node) => {
      if (node.type === 'tag' && node.name === 'a' && node.attribs['data-type']
        && node.attribs['data-type'] === 'internal') {
        const className = node.attribs.class;
        const href = node.attribs.href;
        const linkText = () => { return getChildren(node) };
        return createLink('href', href, linkText, className);
      }
      else if (node.type === 'tag' && node.name === 'img' && node.attribs.src) {
        // transform image URLs in fully qualified URLs, so images are also loaded when requested from React app
        // which typically runs on a different port than CMS / HST
        if (preview) {
          node.attribs.src = globalCmsUrls.preview.baseUrl + node.attribs.src;
        } else {
          node.attribs.src = globalCmsUrls.live.baseUrl + node.attribs.src;
        }
      }
    }
  });
}

function getChildren (node) {
  if (node.children) {
    let linkText = '';
    for (let i = 0; i < node.children.length; i++) {
      const childNode = node.children[i];

      const childText = getChildren(childNode);
      linkText += childText;

      if (childNode.type === 'text') {
        linkText += childNode.data;
      }
    }
    return linkText;
  }
  return '';
}
