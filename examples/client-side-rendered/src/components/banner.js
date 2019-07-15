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
import { createLink, getImageUrl, parseAndRewriteLinks } from 'bloomreach-experience-react-sdk';

export default class Banner extends React.Component {
  render() {
    const content = this.props.content;
    const manageContentButton = this.props.manageContentButton;
    const preview = this.props.preview;
    const image = getImageUrl(content.image, this.props.pageModel, preview);

    let contentHtml;
    if (content.content && content.content.value) {
      contentHtml = parseAndRewriteLinks(content.content.value, preview);
    }

    const link = content.link ? content.link['$ref'] : null;
    // createLink takes linkText as a function so that it can contain HTML elements
    const linkText = () => { return ('Learn more') };
    const className = 'btn btn-primary btn-lg';

    return (
      <div className="jumbotron has-edit-button">
        { manageContentButton && manageContentButton }
        { content.title &&
          <h1>{content.title}</h1>
        }
        { image &&
          <figure>
            <img src={image} alt={content.title}/>
          </figure>
        }
        { contentHtml && contentHtml }
        <p>
          { link && createLink('ref', link, linkText, className) }
        </p>
      </div>
    );
  }
}