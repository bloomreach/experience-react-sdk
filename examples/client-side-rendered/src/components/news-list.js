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
import { ContentComponentWrapper, getNestedObject, Placeholder } from 'bloomreach-experience-react-sdk';

export default class NewsList extends React.Component {
  render() {
    const preview = this.props.preview;
    const pageModel = this.props.pageModel;
    const configuration = this.props.configuration;

    // return placeholder if no list is set on component
    let list = getNestedObject(configuration, ['models', 'pageable', 'items', 0]);
    if (list) {
      list = configuration.models.pageable.items;
    } else if (preview) {
      return (
        <Placeholder name={configuration.label} />
      );
    } else {
      // don't render placeholder outside of preview mode
      return null;
    }

    // build list of news articles
    const listItems = list.map((listItem, index) => {
      if (configuration && typeof configuration === 'object' && configuration.constructor === Object) {
        // change type as we want to render the NewsItem component
        const newsItemConfig = {label: 'News Item'};
        if ('$ref' in listItem) {
          return (
            <ContentComponentWrapper contentRef={listItem.$ref} configuration={newsItemConfig} pageModel={pageModel}
                                     preview={preview} key={index}/>
          );
        }
      }
      console.log('NewsList component configuration is not a map, unexpected format of configuration');
      return null;
    });

    return (
      <div className="row">
        <div className="col-sm-12 news-list">
          {listItems}
        </div>
        <nav className="blog-pagination">
          <a className="btn btn-outline-primary disabled" href="#pagination">Older</a>
          <a className="btn btn-outline-secondary disabled" href="#pagination">Newer</a>
        </nav>
      </div>
    );
  }
}