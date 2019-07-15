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

export default function parseDate(date) {
  const parsedDate = parseFloat(date);
  if(isNaN(parsedDate)) {
    return null;
  }

  const dateObj = new Date(parsedDate);

  return (
    dateObj.getMonthName() + ' ' +
    dateObj.getDate() + ', ' +
    dateObj.getFullYear()
  );
}

// extend JavaScript Date object to return full month names
// eslint-disable-next-line
Date.prototype.getMonthName = function() {
  const months = ["January", "Feburary", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  return months[this.getMonth()];
};