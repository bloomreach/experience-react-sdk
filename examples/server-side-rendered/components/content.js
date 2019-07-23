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
import { getImageUrl, parseAndRewriteLinks, parseDate } from 'bloomreach-experience-react-sdk';

export default class Content extends React.Component {
  render() {
    const { content, manageContentButton, preview } = this.props;
    const image = getImageUrl(content.image, this.props.pageModel, preview);

    let contentHtml;
    if (content.content && content.content.value) {
      contentHtml = parseAndRewriteLinks(content.content.value, preview);
    }

    return (
      <div className="blog-post has-edit-button">
        { manageContentButton && manageContentButton }
        <h2 className="blog-post-title">{content.title}</h2>
        <p className="blog-post-meta">
          { content.date
            && <span className="blog-post-date">{parseDate(content.date)}</span>
          }
          { content.author
            && <span className="author">{content.author}</span>
          }
        </p>
        { content.introduction
          && <p>{content.introduction}</p>
        }
        { image
          && <figure>
            <img src={image} alt={content.title}/>
          </figure>
        }
        { contentHtml && contentHtml }
      </div>
    );
  }
}
