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
import CmsComponent from './component';
import CmsContainer from './container';
import CmsContainerItem from './container-item';
import { withPageModel, PreviewContext } from '../../context';
import getConfigurationForPath from '../../utils/get-configuration-for-path';

class RenderCmsComponent extends React.Component {
  renderPageComponent(configuration) {
    switch (configuration.type) {
      case 'CONTAINER_COMPONENT':
        return <CmsContainer configuration={configuration} />;
      case 'CONTAINER_ITEM_COMPONENT':
        return <CmsContainerItem configuration={configuration} />;
      default:
        return <CmsComponent configuration={configuration}/>;
    }
  }

  renderStaticComponent(renderComponent, configuration, pageModel) {
    return (
      <PreviewContext.Consumer>
        { preview => React.createElement(renderComponent, { configuration, pageModel, preview })
        }
      </PreviewContext.Consumer>
    );
  }

  render() {
    const { path, pageModel, renderComponent } = this.props;

    let configuration;
    // render entire page if no path has been specified
    if (!path) {
      if (pageModel) {
        configuration = pageModel.page;
      } else {
        console.log('<RenderCmsComponent> has no supplied page model');
        return null;
      }
    } else {
      // or lookup component configuration using supplied path
      configuration = getConfigurationForPath(path, pageModel);
      if (configuration && renderComponent) {
        return this.renderStaticComponent(renderComponent, configuration, pageModel);
      }
    }

    if (!configuration) {
      return null;
    }

    return this.renderPageComponent(configuration, renderComponent);
  }
}

export default withPageModel(RenderCmsComponent);
