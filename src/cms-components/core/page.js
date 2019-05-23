import React from 'react';
import { ComponentDefinitionsContext, CreateLinkContext, PageModelContext, PreviewContext } from '../../context';
import { addBodyComments } from '../../utils/add-html-comment';
import { updateCmsUrls } from '../../utils/cms-urls';
import { fetchCmsPage, fetchComponentUpdate } from '../../utils/fetch';
import findChildById from '../../utils/find-child-by-id';
import parseRequest from '../../utils/parse-request';

export default class CmsPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};

    updateCmsUrls(this.props.cmsUrls);
    this.setComponentDefinitions(this.props.componentDefinitions);
    this.state.createLink = this.props.createLink;
    this.parseRequest(this.props.request);

    if (this.props.pageModel) {
      this.state.pageModel = this.props.pageModel;
    }
  }

  setComponentDefinitions(componentDefinitions = {}) {
    // TODO: further check/sanitize input
    if (typeof componentDefinitions === 'object') {
      this.state.componentDefinitions = componentDefinitions
    }
  }

  parseRequest(request) {
    const parsedRequest = parseRequest(request);
    this.state.path = parsedRequest.path;
    this.state.preview = parsedRequest.preview;
    if (this.props.debug) {
      console.log(`### React SDK debugging ### parsing URL-path '%s'`, request.path);
      console.log(`### React SDK debugging ### parsed path is '%s'`, parsedRequest.path);
      console.log(`### React SDK debugging ### preview mode is %s`, parsedRequest.preview);
    }
    return parsedRequest;
  }

  fetchPageModel(path, preview) {
    if (this.props.debug) {
      console.log(`### React SDK debugging ### fetching page model for URL-path '%s'`, path);
    }
    fetchCmsPage(path, preview).then(data => {
      this.updatePageModel(data);
    });
  }

  updatePageModel(pageModel) {
    addBodyComments(pageModel.page, this.state.preview);
    this.setState({
      pageModel: pageModel
    });
    if (this.state.preview && this.cms && typeof this.cms.createOverlay === 'function') {
      if (this.props.debug) {
        console.log(`### React SDK debugging ### creating CMS overlay`);
      }
      this.cms.createOverlay();
    }
  }

  initializeCmsIntegration() {
    if (this.state.preview && typeof window !== 'undefined') {
      window.SPA = {
        renderComponent: (id, propertiesMap) => {
          this.updateComponent(id, propertiesMap);
        },
        init: (cms) => {
          this.cms = cms;
          if (this.state.pageModel) {
            if (this.props.debug) {
              console.log(`### React SDK debugging ### creating CMS overlay`);
            }
            cms.createOverlay();
          }
        }
      };
    }
  }

  updateComponent(componentId, propertiesMap) {
    if (this.props.debug) {
      console.log(`### React SDK debugging ### component update triggered for '%s' with properties:`, componentId);
      console.dir(propertiesMap);
    }
    // find the component that needs to be updated in the page structure object using its ID
    const componentToUpdate = findChildById(this.state.pageModel, componentId);
    if (componentToUpdate !== undefined) {
      fetchComponentUpdate(this.state.path, this.state.preview, componentId, propertiesMap).then(response => {
        // API can return empty response when component is deleted
        if (response) {
          if (response.page) {
            componentToUpdate.parent[componentToUpdate.idx] = response.page;
          }
          // update content by merging with original content map
          if (response.content) {
            // if page had no associated content (e.g. empty/new page) then there is no content map, so create it
            if (!this.state.pageModel.content) {
              this.state.pageModel.content = {};
            }
            let content = this.state.pageModel.content;
            // ignore error on next line, as variable is a reference to a sub-object of pageModel
            // and will be used when pageModel is updated/set
            content = Object.assign(content, response.content); // eslint-disable-line
          }
          // update the page model after the component/container has been updated
          this.setState({
            pageModel: this.state.pageModel
          });
        }
      });
    }
  }

  componentDidUpdate (prevProps, prevState) {
    if (this.props.request.path !== prevProps.request.path) {
      const parsedUrl = this.parseRequest(this.props.request);
      this.fetchPageModel(parsedUrl.path, parsedUrl.preview);
    }
  }

  componentDidMount() {
    this.initializeCmsIntegration();
    // fetch page model if not supplied
    if (!this.state.pageModel) {
      this.fetchPageModel(this.state.path, this.state.preview);
    } else {
      // add body comments client-side as document variable is undefined server-side
      addBodyComments(this.state.pageModel.page, this.state.preview);
    }
  }

  render() {
    const pageModel = this.state.pageModel;

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
