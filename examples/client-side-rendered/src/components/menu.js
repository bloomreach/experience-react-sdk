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
import { CmsEditButton, createLink, getNestedObject } from 'bloomreach-experience-react-sdk';

export default class CmsMenu extends React.Component {
  renderMenu(configuration) {
    return configuration.models.menu.siteMenuItems.map(
      menuItem => <CmsMenuItem configuration={menuItem} key={menuItem.name} />,
    );
  }

  render() {
    const { configuration, preview } = this.props;

    if (!getNestedObject(configuration, ['models', 'menu', 'siteMenuItems', 0])) {
      return null;
    }

    const menuConfiguration = getNestedObject(configuration, ['models', 'menu']);
    const editButton = preview ? <CmsEditButton configuration={menuConfiguration} preview={preview} /> : null;

    return (
      <ul className="navbar-nav mr-auto">
        { editButton }
        { this.renderMenu(configuration) }
      </ul>
    );
  }
}

class CmsMenuItem extends React.Component {
  render() {
    const { configuration } = this.props;

    if (!configuration) {
      return null;
    }

    const activeElm = configuration.selected ? <span className="sr-only">(current)</span> : null;
    // createLink takes linkText as a function so that it can contain HTML elements
    const linkText = () => <React.Fragment>{configuration.name}{activeElm}</React.Fragment>;
    const className = 'nav-link';

    return (
      <li className="nav-item">
        { createLink('self', configuration, linkText, className) }
      </li>
    );
  }
}
