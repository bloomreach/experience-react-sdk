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

export function NewsListPagination(props) {
  if (!props.showPagination) {
    return null;
  }

  return (
    <nav aria-label="News List Pagination">
      <ul className="pagination">
        <li className={`page-item ${props.previous ? '' : 'disabled'}`}>
          <a className="page-link" href={props.previous ? `?page=${props.previousPage}` : '#'} aria-label="Previous">
            <span aria-hidden="true">&laquo;</span>
            <span className="sr-only">Previous</span>
          </a>
        </li>
        { props.pageNumbersArray.map((page, key) => (
          <li key={key} className={`page-item ${page === props.currentPage ? 'active' : ''}`}>
            <a className="page-link" href={`?page=${page}`}>{page}</a>
          </li>
        )) }
        <li className={`page-item ${props.next ? '' : 'disabled'}`}>
          <a className="page-link" href={props.next ? `?page=${props.nextPage}` : '#'} aria-label="Next">
            <span aria-hidden="true">&raquo;</span>
            <span className="sr-only">Next</span>
          </a>
        </li>
      </ul>
    </nav>
  );
}

export default class NewsList extends React.Component {
  render() {
    const { preview, pageModel, configuration } = this.props;

    // return placeholder if no list is set on component
    let list = getNestedObject(configuration, ['models', 'pageable', 'items', 0]);
    if (!list) {
      return preview
        ? <Placeholder name={configuration.label} />
        : null;
    }

    list = configuration.models.pageable.items;

    // build list of news articles
    const listItems = list.map((listItem, index) => {
      if (!configuration
        || typeof configuration !== 'object'
        || configuration.constructor !== Object
        || !('$ref' in listItem)) {
        console.log('NewsList component configuration is not a map, unexpected format of configuration');
        return null;
      }

      const newsItemConfig = { label: 'News Item' };

      return <ContentComponentWrapper
        contentRef={listItem.$ref}
        configuration={newsItemConfig}
        pageModel={pageModel}
        preview={preview}
        key={index}
      />;
    });

    return (
      <div className="row">
        <div className="col-sm-12 news-list">
          {listItems}
        </div>
        <div className="col-sm-12">
          <NewsListPagination {...getNestedObject(configuration, ['models', 'pageable'])} />
        </div>
      </div>
    );
  }
}
