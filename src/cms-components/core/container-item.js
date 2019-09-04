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
          { this.renderContainerItemComponent(configuration, pageModel, preview, componentDefinitions) }
        </div>
      );
    }

    if (configuration) {
      return this.renderContainerItemComponent(configuration, pageModel, preview, componentDefinitions);
    }

    return null;
  }

  renderContainerItemComponent(component, pageModel, preview, componentDefinitions) {
    // component not defined in component-definitions
    if (!(component.label in componentDefinitions)) {
      return <UndefinedComponent name={component.label} />;
    }

    const componentDefinition = componentDefinitions[component.label];
    // based on the type of the component, render a different React component
    if ('wrapInContentComponent' in componentDefinition
      && componentDefinition.wrapInContentComponent) {
      // wrap component in ContentComponentWrapper class
      return <ContentComponentWrapper
        configuration={component}
        pageModel={pageModel}
        preview={preview}
        componentDefinitions={componentDefinitions}
      />;
    }

    if (componentDefinition.component) {
      // component is defined and does not have to be wrapped in ContentComponent, so render the actual component
      return React.createElement(componentDefinition.component, {
        configuration: component,
        pageModel,
        preview,
        componentDefinitions,
      }, null);
    }

    return null;
  }

  addMetaData(htmlElm, configuration, preview) {
    addBeginComment(htmlElm, 'afterbegin', configuration, preview);
    addEndComment(htmlElm, 'beforeend', configuration, preview);
  }

  render() {
    const { configuration } = this.props;

    return (
      <PageModelContext.Consumer>
        { pageModel => <PreviewContext.Consumer>
            { preview => <ComponentDefinitionsContext.Consumer>
                { componentDefinitions => this.renderContainerItem(
                  configuration,
                  pageModel,
                  preview,
                  componentDefinitions,
                ) }
          </ComponentDefinitionsContext.Consumer> }
      </PreviewContext.Consumer> }
    </PageModelContext.Consumer>
    );
  }
}
