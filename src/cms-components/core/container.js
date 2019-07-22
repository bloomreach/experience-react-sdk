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
import { PreviewContext } from '../../context';

export default class CmsContainer extends React.Component {
  renderContainerWrapper(configuration, preview) {
    if (preview) {
      return (
        // need to wrap container inside a div instead of React.Fragment because otherwise HTML comments are not removed
        <div>
          <div className="hst-container"
               ref={(containerElm) => { this.addMetaData(containerElm, configuration, preview); }}>
            { this.renderContainer(configuration) }
          </div>
        </div>
      );
    }
    return (
        <React.Fragment>
          { this.renderContainer(configuration) }
        </React.Fragment>
    );
  }

  renderContainer(configuration = { components: [] }) {
    if (!configuration.components || !configuration.components.length) {
      return null;
    }

    // render all of the container-item-components
    return configuration.components.map(component => (
      <CmsContainerItem configuration={component} key={component.id} />
    ));
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
      <PreviewContext.Consumer>
        { preview => <React.Fragment>
            { this.renderContainerWrapper(this.props.configuration, preview) }
          </React.Fragment>
        }
      </PreviewContext.Consumer>
    );
  }
}
