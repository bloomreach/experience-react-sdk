import React from 'react';
import ReactHtmlParser from 'react-html-parser';
import cmsUrls from './cms-urls';
import createLink from './create-link';

export default function parseAndRewriteLinks (html) {
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
        node.attribs.src = cmsUrls.cmsBaseUrl + node.attribs.src;
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
