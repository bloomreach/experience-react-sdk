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

// returns parent and index of child referenced by ID,
// so that we can easily replace the child
export default function findChildById(object, id, parent, idx) {
  const props = Object.keys(object);
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < props.length; i++) {
    const prop = props[i];
    if (typeof object[prop] === 'object' && object[prop] !== null) {
      const result = findChildById(object[prop], id, object, prop);
      if (result) {
        return result;
      }
    } else if (prop === 'id' && object.id === id) {
      return { parent, idx };
    }
  }

  return null;
}
