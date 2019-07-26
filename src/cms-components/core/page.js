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
import {
  ComponentDefinitionsContext,
  CreateLinkContext,
  PageModelContext,
  PreviewContext,
} from '../../context';
import { addBodyComments } from '../../utils/add-html-comment';
import { updateCmsUrls, parseRequest } from '../../utils/cms-urls';
import { fetchCmsPage, fetchComponentUpdate } from '../../utils/fetch';
import findChildById from '../../utils/find-child-by-id';

export default class CmsPage extends React.Component {
  constructor(props) {
    super(props);
    updateCmsUrls(this.props.cmsUrls);

    this.state = parseRequest(this.props.request);
    this.state.createLink = this.props.createLink;
    if (typeof this.props.componentDefinitions === 'object') {
      this.state.componentDefinitions = this.props.componentDefinitions;
    }

    if (this.props.pageModel) {
      this.state.pageModel = this.props.pageModel;
    }
  }

  async fetchPageModel(path, query, preview) {
    if (this.props.debug) {
      console.log('### React SDK debugging ### fetching page model for URL-path \'%s\'', path);
    }
    const data = await fetchCmsPage(path, query, preview);
    this.updatePageModel(data);
  }

  updatePageModel(pageModel) {
    addBodyComments(pageModel.page, this.state.preview);
    this.setState({
      pageModel,
    });
    if (this.state.preview && this.cms && typeof this.cms.createOverlay === 'function') {
      if (this.props.debug) {
        console.log('### React SDK debugging ### creating CMS overlay');
      }
      this.cms.createOverlay();
    }
  }

  initializeCmsIntegration() {
    if (!this.state.preview || typeof window === 'undefined') {
      return;
    }

    window.SPA = {
      renderComponent: this.updateComponent.bind(this),
      init: (cms) => {
        this.cms = cms;
        if (this.state.pageModel) {
          if (this.props.debug) {
            console.log('### React SDK debugging ### creating CMS overlay');
          }
          cms.createOverlay();
        }
      },
    };
  }

  async updateComponent(componentId, propertiesMap) {
    if (this.props.debug) {
      console.log('### React SDK debugging ### component update triggered for \'%s\' with properties:', componentId);
      console.dir(propertiesMap);
    }
    // find the component that needs to be updated in the page structure object using its ID
    const componentToUpdate = findChildById(this.state.pageModel, componentId);
    if (componentToUpdate == null) {
      return;
    }

    const response = await fetchComponentUpdate(
      this.state.path,
      this.state.query,
      this.state.preview,
      componentId,
      propertiesMap,
    );
    // API can return empty response when component is deleted
    if (!response) {
      return;
    }

    if (response.page) {
      componentToUpdate.parent[componentToUpdate.idx] = response.page;
    }

    // if page had no associated content (e.g. empty/new page) then there is no content map, so create it
    if (response.content && !this.state.pageModel.content) {
      // eslint-disable-next-line react/no-direct-mutation-state
      this.state.pageModel.content = {};
    }
    if (response.content) {
      Object.assign(this.state.pageModel.content, response.content);
    }

    // update the page model after the component/container has been updated
    this.setState({ pageModel: this.state.pageModel });
  }

  componentDidUpdate(prevProps) {
    if (this.props.request.path !== prevProps.request.path) {
      const parsedUrl = parseRequest(this.props.request);
      Object.assign(this.state, parsedUrl);
      this.fetchPageModel(parsedUrl.path, parsedUrl.query, parsedUrl.preview);
    }
  }

  componentDidMount() {
    this.initializeCmsIntegration();
    // fetch page model if not supplied
    if (!this.state.pageModel) {
      this.fetchPageModel(this.state.path, this.state.query, this.state.preview);
    } else {
      // add body comments client-side as document variable is undefined server-side
      addBodyComments(this.state.pageModel.page, this.state.preview);
    }
  }

  render() {
    const { pageModel } = this.state;

    if (!pageModel || !pageModel.page) {
      return null;
    }

    return (
      <ComponentDefinitionsContext.Provider value={this.state.componentDefinitions}>
        <PageModelContext.Provider value={pageModel}>
          <PreviewContext.Provider value={this.state.preview}>
            <CreateLinkContext.Provider value={this.state.createLink}>
              { this.props.children() }
            </CreateLinkContext.Provider>
          </PreviewContext.Provider>
        </PageModelContext.Provider>
      </ComponentDefinitionsContext.Provider>
    );
  }
}
