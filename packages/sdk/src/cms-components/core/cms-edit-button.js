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
import getNestedObject from '../../utils/get-nested-object';

export default class CmsEditButton extends React.Component {
  constructor(props) {
    super(props);

    this.placeholder = React.createRef();
  }

  addButton(htmlElm) {
    const { configuration, preview } = this.props;
    addBeginComment(htmlElm, 'afterbegin', configuration, preview);
  }

  shouldComponentUpdate(nextProps) {
    const path = ['_meta', 'beginNodeSpan', 0, 'data'];

    return getNestedObject(this.props.configuration, path) !== getNestedObject(nextProps.configuration, path);
  }

  componentDidMount() {
    if (!this.placeholder.current) {
      return;
    }

    this.addButton(this.placeholder.current);
  }

  componentDidUpdate() {
    const placeholder = this.placeholder.current;
    if (!placeholder) {
      return;
    }

    Array.from(placeholder.childNodes)
      .forEach(node => node.remove());
    placeholder.removeAttribute('class');
    this.addButton(placeholder);
  }

  render() {
    if (!this.props.preview) {
      return null;
    }

    return (
      <div style={{ position: 'relative' }}>
        <span ref={this.placeholder}/>
      </div>
    );
  }
}
