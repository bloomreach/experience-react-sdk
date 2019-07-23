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
import jsonpointer from 'jsonpointer';
import PlaceholderComponent from './placeholder';
import UndefinedComponent from './undefined';
import CmsEditButton from './cms-edit-button';
import { ComponentDefinitionsContext } from '../../context';
import getNestedObject from '../../utils/get-nested-object';

export default class ContentComponentWrapper extends React.Component {
  renderContentComponentWrapper(component, pageModel, content, preview, componentDefinitions, manageContentButton) {
    // based on the type of the component, render a different React component
    if (component.label in componentDefinitions && componentDefinitions[component.label].component) {
      // component is defined, so render the component
      const componentEl = React.createElement(componentDefinitions[component.label].component,
        {
          content, pageModel, preview, manageContentButton,
        }, null);
      return (componentEl);
    }
    // component not defined in component-definitions
    return (
        <UndefinedComponent name={component.label}/>
    );
  }

  render() {
    const { configuration, pageModel, preview } = this.props;
    let content;

    // get content from model
    let contentRef = getNestedObject(configuration, ['models', 'document', '$ref']);
    if (!contentRef) {
      // NewsList component passed document ID through property instead of via reference in attributes map
      ({ contentRef } = this.props);
    }

    if (contentRef && (typeof contentRef === 'string' || contentRef instanceof String)) {
      content = jsonpointer.get(pageModel, contentRef);
    }

    if (!content && preview) {
      // return placeholder if no document is set on component
      return (
        <PlaceholderComponent name={configuration.label} />
      );
    }

    if (!content) {
      // don't render placeholder outside of preview mode
      return null;
    }

    // create edit content button and pass as a prop
    const manageContentButton = preview ? <CmsEditButton configuration={content} preview={preview} /> : null;

    return (
      <ComponentDefinitionsContext.Consumer>
        { componentDefinitions => this.renderContentComponentWrapper(
          configuration,
          pageModel,
          content,
          preview,
          componentDefinitions,
          manageContentButton,
        ) }
      </ComponentDefinitionsContext.Consumer>
    );
  }
}
