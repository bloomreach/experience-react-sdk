import React from 'react';
import jsonpointer from 'jsonpointer';
import getNestedObject from './get-nested-object';
import { CreateLinkContext, PageModelContext } from '../context';

function _createLink(linkType, link, linkText, className, externalCreateLinkFunction, pageModel) {
  let href = null;
  let internalLink = null;
  switch (linkType) {
    case 'self':
      href = getNestedObject(link, ['_links', 'site', 'href']);
      internalLink = getNestedObject(link, ['_links', 'site', 'type']);
      break;
    case 'ref':
      if (link && (typeof link === 'string' || link instanceof String)) {
        const linkedContent = jsonpointer.get(pageModel, link);
        if (linkedContent) {
          href = getNestedObject(linkedContent, ['_links', 'site', 'href']);
          internalLink = getNestedObject(linkedContent, ['_links', 'site', 'type']);
        }
      }
      break;
    case 'href':
      href = link;
      internalLink = 'internal';
      break;
  }

  // linkText is a function insteaf of a string, so that additional HTML can be included inside the anchor tag
  if (href && internalLink && typeof linkText === 'function') {
    if (internalLink === 'internal' && typeof externalCreateLinkFunction === 'function') {
      return externalCreateLinkFunction(href, linkText, className);
    } else {
      return (<a className={className} href={href}>{linkText()}</a>)
    }
  }
  return null;
}

export default function createLink(linkType, link, linkText, className) {
  return (
    <PageModelContext.Consumer>
      { pageModel =>
        <CreateLinkContext.Consumer>
          { externalCreateLinkFunction => _createLink(linkType, link, linkText, className, externalCreateLinkFunction,
            pageModel) }
        </CreateLinkContext.Consumer>
      }
    </PageModelContext.Consumer>
  );
}