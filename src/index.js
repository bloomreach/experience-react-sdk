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

// exports for fetching API and rendering
export { getApiUrl } from './utils/cms-urls';
export { default as CmsPage } from './cms-components/core/page';
export { default as RenderCmsComponent } from './cms-components/core/render-cms-component';

// exports for building custom components
export { default as ContentComponentWrapper } from './cms-components/core/content-component-wrapper';
export { default as CmsEditButton } from './cms-components/core/cms-edit-button';
export { default as Placeholder } from './cms-components/core/placeholder';
export { default as createLink } from './utils/create-link';
export { default as parseDate } from './utils/date';
export { default as getNestedObject } from './utils/get-nested-object';
export { getImageUrl } from './utils/image-url';
export { getImageUrlByPath } from './utils/image-url';
export { default as parseAndRewriteLinks } from './utils/link-rewriter';
