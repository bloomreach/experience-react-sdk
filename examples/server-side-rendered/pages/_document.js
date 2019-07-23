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

import Document, { Head, Main, NextScript } from 'next/document';

export default class DefaultDocument extends Document {
  render() {
    return (
      <html lang='en'>
        <head>
          <meta charset='utf-8' />
          <meta name='viewport' content='width=device-width, initial-scale=1, shrink-to-fit=no' />
          <meta name='description' content='Example Server-side React App for BloomReach Experience' />
          <meta name='author' content='Robbert Kauffman, Solution Consultant, BloomReach' />

          <title>React App</title>

          <link rel='stylesheet' href='http://localhost:3000/static/bootstrap.min.css' media='screen' />
          <link rel='stylesheet' href='http://localhost:3000/static/custom.css' media='screen' />

          <Head />
        </head>
        <body>
          <div id='root'>
            <Main />
          </div>
          <footer>
            <p>&copy; 2018 BloomReach, Inc.</p>
          </footer>
          <NextScript />
        </body>
      </html>
    );
  }
}
