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

import getNestedObject from './get-nested-object';

function getConfigurationForPathSegment(pathSegment, configuration) {
  return configuration.components.find(component => pathSegment === component.name || pathSegment === '*') || null;
}

export default function getConfigurationForPath(path, pageModel) {
  const pathSegments = path.split('/');
  let currPath;
  let configuration = pageModel.page;

  while (getNestedObject(configuration, ['components', 0])) {
    // match the next path segment
    currPath = pathSegments.shift();

    configuration = getConfigurationForPathSegment(currPath, configuration);

    if (configuration && pathSegments.length === 0) {
      // this was the last path segment and we retrieved configuration, so we can return the configuration
      return configuration;
    }
  }

  return null;
}
