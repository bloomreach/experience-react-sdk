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
import Error from 'next/error';
import Link from 'next/link';
import { withRouter } from 'next/router';

import fetch from 'isomorphic-unfetch';
import { getApiUrl, CmsPage, RenderCmsComponent } from 'bloomreach-experience-react-sdk';

import Banner from '../components/banner';
import Content from '../components/content';
import CmsMenu from '../components/menu';
import NewsItem from '../components/news-item';
import NewsList from '../components/news-list';

const BR_ORIGIN = new URL(process.env.BR_ORIGIN);
const BR_CONTEXT_PATH = process.env.BR_CONTEXT_PATH;
const BR_CHANNEL_PATH = process.env.BR_CHANNEL_PATH;

const urlConfig = {
  scheme: BR_ORIGIN.protocol.slice(0, -1),
  hostname: BR_ORIGIN.hostname,
  port: BR_ORIGIN.port,
  contextPath: BR_CONTEXT_PATH,
  channelPath: BR_CHANNEL_PATH
};

const cmsUrls = {
  preview: urlConfig,
  live: urlConfig
};

const componentDefinitions = {
  Banner: { component: Banner, wrapInContentComponent: true },
  Content: { component: Content, wrapInContentComponent: true },
  'News List': { component: NewsList },
  'News Item': { component: NewsItem, wrapInContentComponent: true },
};

const createLink = (href, linkText, className) => <Link href={href}><a className={className}>{linkText()}</a></Link>;

export class Index extends React.Component {
  static async getInitialProps({ req, asPath }) {
    // setting pageModel to empty list instead of null value,
    // as otherwise the API will be fetched client-side again after server-side fetch errors
    let pageModel = {};

    // hostname and URL-path are used for detecting if site is viewed in CMS preview
    // and for fetching Page Model for the viewed page
    const request = {
      hostname: req.headers.host,
      path: asPath,
    };
    const url = getApiUrl(request, cmsUrls);
    const response = await fetch(url, { headers: { Cookie: req.headers.cookie } });

    if (response.ok) {
      try {
        pageModel = await response.json();
      } catch (err) {
        console.log(`Error! Could not convert response to JSON for URL: ${url}`);
        console.log(err);
      }
    } else {
      console.log(`Error! Status code ${response.status} while fetching CMS page data for URL: ${url}`);
    }

    return {
      pageModel,
      request,
      errorCode: !response.ok ? response.status : null,
    };
  }

  render() {
    const { errorCode, request } = this.props;

    if (errorCode) {
      return (<Error statusCode={errorCode} />);
    }

    return (
      <CmsPage componentDefinitions={componentDefinitions} cmsUrls={cmsUrls} pageModel={this.props.pageModel}
          request={request} createLink={createLink}>
        <div id='header'>
          <nav className='navbar navbar-expand-md navbar-dark bg-dark'>
            <span className='navbar-brand'>Server-side React Demo</span>
            <button className='navbar-toggler' type='button' data-toggle='collapse' data-target='#navbarCollapse'
                    aria-controls='navbarCollapse' aria-expanded='false' aria-label='Toggle navigation'>
              <span className='navbar-toggler-icon' />
            </button>
            <div className='collapse navbar-collapse' id='navbarCollapse'>
              <RenderCmsComponent path='menu' renderComponent={CmsMenu} />
            </div>
          </nav>
        </div>
        <div className='container marketing'>
          <RenderCmsComponent />
        </div>
      </CmsPage>
    );
  }
}

export default withRouter(Index);
