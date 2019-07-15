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
import ContentComponentWrapper from './content-component-wrapper';
import UndefinedComponent from './undefined';
import { addBeginComment, addEndComment } from '../../utils/add-html-comment';
import { ComponentDefinitionsContext, PageModelContext, PreviewContext } from '../../context';

export default class CmsContainerItem extends React.Component {
  renderContainerItem(configuration, pageModel, preview, componentDefinitions) {
    if (preview && configuration) {
      return (
        <div className="hst-container-item"
             ref={(containerItemElm) => { this.addMetaData(containerItemElm, configuration, preview); }}>
          <React.Fragment>
            { this.renderContainerItemComponent(configuration, pageModel, preview, componentDefinitions) }
          </React.Fragment>
        </div>
      );
    } else if (configuration) {
      return (
        <React.Fragment>
          { this.renderContainerItemComponent(configuration, pageModel, preview, componentDefinitions) }
        </React.Fragment>
      );
    } else {
      return null;
    }
  }

  renderContainerItemComponent(component, pageModel, preview, componentDefinitions) {
    // based on the type of the component, render a different React component
    if (component.label in componentDefinitions) {
      if ('wrapInContentComponent' in componentDefinitions[component.label]
        && componentDefinitions[component.label]['wrapInContentComponent']) {
        // wrap component in ContentComponentWrapper class
        return (
          <ContentComponentWrapper configuration={component} pageModel={pageModel} preview={preview}
                                   componentDefinitions={componentDefinitions} />
        );
      } else if (componentDefinitions[component.label].component) {
        // component is defined and does not have to be wrapped in ContentComponent, so render the actual component
        const componentEl = React.createElement(componentDefinitions[component.label].component,
          { configuration: component, pageModel: pageModel, preview: preview,
            componentDefinitions: componentDefinitions}, null);
        return (componentEl);
      }
    } else {
      // component not defined in component-definitions
      return (
        <UndefinedComponent name={component.label} />
      );
    }
  }

  addMetaData(htmlElm, configuration, preview) {
    addBeginComment(htmlElm, 'afterbegin', configuration, preview);
    addEndComment(htmlElm, 'beforeend', configuration, preview);
  }

  render() {
    const configuration = this.props.configuration;

    return (
      <PageModelContext.Consumer>
        { pageModel =>
          <PreviewContext.Consumer>
            { preview =>
              <ComponentDefinitionsContext.Consumer>
                { componentDefinitions =>
                  this.renderContainerItem(configuration, pageModel, preview, componentDefinitions)
                }
              </ComponentDefinitionsContext.Consumer>
            }
          </PreviewContext.Consumer>
        }
      </PageModelContext.Consumer>
    );
  }
}