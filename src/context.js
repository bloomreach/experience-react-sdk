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

export const PageModelContext = React.createContext({});
export const PreviewContext = React.createContext('');
export const ComponentDefinitionsContext = React.createContext({});
export const CreateLinkContext = React.createContext();

export function withPageModel(Component) {
  return function PageModelComponent(props) {
    return (
      <PageModelContext.Consumer>
        {pageModel => <Component {...props} pageModel={pageModel} />}
      </PageModelContext.Consumer>
    );
  };
}
