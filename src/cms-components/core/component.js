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
import CmsContainer from './container';

export default class CmsComponent extends React.Component {
  renderComponentWrapper(configuration) {
    // based on the name of the container, render a different wrapper
    switch (configuration.name) {
      // add additional cases here if you need custom HTML wrapped around any of the components
      default:
        return (
          <React.Fragment>
            { this.renderComponent(configuration) }
          </React.Fragment>
        );
    }
  }

  renderComponent(configuration = { components: [] }) {
    if (!configuration.components || !configuration.components.length) {
      return null;
    }

    // render all of the nested components
    return configuration.components.map((component) => {
      if (component.type === 'CONTAINER_COMPONENT') {
        // render container
        return (
          <CmsContainer configuration={component} key={component.id}/>
        );
      }
      // render regular component
      return (
          <CmsComponent configuration={component} key={component.id}/>
      );
    });
  }

  render() {
    if (!this.props.configuration) {
      return null;
    }

    return (
      <React.Fragment>
        { this.renderComponentWrapper(this.props.configuration) }
      </React.Fragment>
    );
  }
}
