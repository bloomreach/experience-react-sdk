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
import { addBeginComment } from '../../utils/add-html-comment';

export default class CmsEditButton extends React.Component {
  addButton(htmlElm, configuration, preview) {
    addBeginComment(htmlElm, 'afterbegin', configuration, preview);
  }

  render() {
    const { configuration, preview } = this.props;

    if (!preview) {
      return null;
    }

    return (
      <div style={{ position: 'relative' }}>
        <span ref={(editContentElm) => { this.addButton(editContentElm, configuration, preview); }}/>
      </div>
    );
  }
}