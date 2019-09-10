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
import CmsContainerItem from './container-item';
import { addBeginComment, addEndComment } from '../../utils/add-html-comment';
import { ComponentDefinitionsContext, PageModelContext, PreviewContext } from '../../context';

export default class CmsContainer extends React.Component {
  renderContainerWrapper(configuration, pageModel, preview, componentDefinitions) {
    if (preview) {
      return (
        // need to wrap container inside a div instead of React.Fragment because otherwise HTML comments are not removed
        <div>
          <div className="hst-container"
               ref={(containerElm) => { this.addMetaData(containerElm, configuration, preview); }}>
            { this.renderContainer(configuration, pageModel, preview, componentDefinitions) }
          </div>
        </div>
      );
    }

    return this.renderContainer(configuration, pageModel, preview, componentDefinitions);
  }

  renderContainer(configuration = { components: [] }, pageModel, preview, componentDefinitions) {
    const { components, label } = configuration;

    // don't render anything when there're no components found
    if (!components || components.length === 0) {
      return null;
    }

    // get component item components
    const containerItemComponents = components.map(component => {
      return <CmsContainerItem configuration={component} key={component.id} />;
    });

    // check if component container is found in component definitions
    const ContainerComponent = componentDefinitions[label] && componentDefinitions[label].component;

    // if found then wrap container items with this component
    if (!!ContainerComponent) {
      return React.createElement(
        ContainerComponent,
        { configuration, pageModel, preview, componentDefinitions },
        containerItemComponents
      );
    }

    return (
      <React.Fragment>
        { containerItemComponents }
      </React.Fragment>
    );
  }

  addMetaData(htmlElm, configuration, preview) {
    addBeginComment(htmlElm, 'beforebegin', configuration, preview);
    addEndComment(htmlElm, 'afterend', configuration, preview);
  }

  render() {
    if (!this.props.configuration) {
      return null;
    }

    return (
      <PageModelContext.Consumer>
        {pageModel => (
          <PreviewContext.Consumer>
            {preview => (
              <ComponentDefinitionsContext.Consumer>
                {componentDefinitions => this.renderContainerWrapper(
                  this.props.configuration,
                  pageModel,
                  preview,
                  componentDefinitions,
                )}
              </ComponentDefinitionsContext.Consumer>
            )}
          </PreviewContext.Consumer>
        )}
      </PageModelContext.Consumer>
    );
  }
}
