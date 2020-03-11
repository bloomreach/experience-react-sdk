# BloomReach Experience SDK for React

> The BloomReach Experience SDK for React works only with [Bloomreach Experience](https://www.bloomreach.com/en/products/experience-manager) version 13 and below. Please use [@bloomreach/react-sdk](https://www.npmjs.com/package/@bloomreach/react-sdk) with all the latest versions of Bloomreach Experience.

SDK for powering content and components in React applications by [BloomReach Experience](https://www.bloomreach.com/en/products/experience). 
This library makes integrating a React app with BloomReach Experience a breeze. It supports both 
client-side- and server-side rendered/isomorphic React apps. 

BloomReach Experience allows you to use an external front-end such as React for rendering while still 
providing a native-like authoring experience, such as integrated preview, in-context editing, drag & 
drop, server-side personalization. For more information on this approach, see [A new approach to 
integrating SPA's with WCM: Fixing what's wrong with headless integrations](https://www.bloomreach.com/en/blog/2018/03/a-new-approach-to-integrating-spas-with-wcm-fixing-what%E2%80%99s-wrong-with-headless-integrations.html).

## Install

```bash
npm install --save bloomreach-experience-react-sdk
```

## Usage

```jsx
import React from 'react'
import { CmsPage, RenderCmsComponent } from 'bloomreach-experience-react-sdk'

const componentDefinitions = {
  "MyCustomComponent": { component: MyCustomComponent }
}

class MyApp extends React.Component {
  render() {
    const request = { hostname: window.location.hostname, path: window.location.pathname + window.location.search };
    return (
      <CmsPage componentDefinitions={componentDefinitions} request={request}>
        <RenderCmsComponent />
      </CmsPage>
    )
  }
}
```

At a minimum, `<CmsPage>` and `<RenderCmsComponent>` should be imported in the React app.

`<CmsPage>` fetches the Page Model when it is not supplied as a prop (see section on server-side 
rendering); it fetches updates to the page model on component changes in the CMS; and it initializes and 
manages state, and provides this as context to `<RenderCmsComponent>`. The `<CmsPage>` component can be 
put anywhere within the React App.

`<RenderCmsComponent>` renders components based on the Page Model API response. It consumes the state 
from `<CmsPage>` and renders the container components and any content referenced from the components as 
contained in the Page Model API response. The `<RenderCmsComponent>` should be nested within `<CmsPage>` 
and placed in the React app at the exact location where you want BloomReach Experience to control what 
components and content is rendered.

`<CmsPage>` takes two props: `componentDefinitions` and `request`.

The `request` prop is used to fetch the Page Model for the current page; and to detect whether 
preview mode is active so that meta-data for Channel Manager functionality (e.g. in-context editing) is 
included in the HTML, and consequently Channel Manager functionality is enabled.

Finally, component definitions are supplied through the `componentDefinitions` prop. The component 
definitions tell `<RenderCmsComponent>` what React component to render by mapping these to the 
*hst:label* of a CMS catalog component.

## Server-side rendering

For server-side rendering (e.g. using [Next.js](https://github.com/zeit/next.js)) you need to fetch the 
Page Model API server-side and supply it as a prop to `<CmsPage>`. Apart from this the usage is the same 
as with client-side rendering.

The helper function `getApiUrl()` can be used to generate the Page Model API URL using the current 
request.

It is important to pass cookies from the initial request and supply these with the request header of the 
Page Model API request. Otherwise you will get a 403 error in preview mode.

Finally, to get preview to work for server-side rendered apps you can use a reverse proxy to route 
requests from BloomReach's site preview to the React App-server. For more details, see section *3.2 
Server-side apps* of the Hippo Lab: [Integrate a React application with BloomReach Experience](https://www.onehippo.org/labs/integrate-a-react-application-with-bloomreach-experience.html).

```jsx
import fetch from 'isomorphic-unfetch'
import { getApiUrl, CmsPage, RenderCmsComponent } from 'bloomreach-experience-react-sdk'

// setting pageModel to empty list instead of null value,
// as otherwise the API will be fetched client-side again after server-side fetch errors
let pageModel = {}

const request = { hostname: req.headers.host, path: asPath }
const url = getApiUrl(request, {})
// pass cookies of initial request for CMS preview
const response = await fetch(url, {headers: {'Cookie': req.headers.cookie}})

if (response.ok) {
  try {
    pageModel = await response.json()
  } catch (err) {
    console.log(`Error! Could not convert response to JSON for URL: ${url}`)
  }
} else {
  console.log(`Error! Status code ${response.status} while fetching CMS page data for URL: ${url}`)
}
```  

## Example React apps

There are two example React apps available that use the SDK. One client-side rendered, and one 
server-side rendered using [Next.js](https://github.com/zeit/next.js). You can find the [example apps on 
Github](https://github.com/bloomreach/experience-react-sdk/tree/master/examples).

## Creating custom components

Any components that are supplied through the `compenentDefinitions` prop can be any type of valid React 
component, including functional components. Props are passed to these components as context so that you 
can access the components' configuration, content, etc. See more information below.

### Props

The following props are passed to a component that is rendered by `<RenderCmsComponent>`:
- `configuration` - `Object` component configuration. Contains the contributed models, raw parameters 
 and resolved parameters. Content included in the component's model is not serialized as part of the 
 component's configuration but in a separate content object, and a JSON Pointer reference is used to 
 link to the actual content object. This is done to prevent content from being included multiple times 
 in the API response when referenced multiple times on a page. 
- `pageModel` - `Object` full Page Model API response.
- `preview` - `Boolean` is *true* if preview mode is active based on current URL supplied through 
 `request` prop of `<CmsPage>`.

For more information on the Page Model API response, see the [Swagger documentation](https://www.onehippo.org/library/concepts/spa-plus/page-model-api/swagger-api-documentation.html).

### Example

```jsx
import React from 'react'
import NewsItem from './news-item'
import { getNestedObject } from 'bloomreach-experience-react-sdk'

export default class NewsList extends React.Component {
  render() {
    const preview = this.props.preview
    const pageModel = this.props.pageModel
    const configuration = this.props.configuration

    // return placeholder if no list is set on component
    const list = getNestedObject(configuration, ['models', 'pageable', 'items'])
    if (!list && preview) {
      return (<p>Click to configure {configuration.label}</p>)
    } else if (!list) {
      // don't render placeholder outside of preview mode
      return null
    }

    // build list of news articles
    const listItems = list.map((listItem, index) => {
      if ('$ref' in listItem) {
        return (<NewsItem contentRef={listItem.$ref} pageModel={pageModel} preview={preview} key={index}/>)
      }
    })

    return (
      <div className="row">
        <div className="col-sm-12 news-list">
          {listItems}
        </div>
      </div>
    )
  }
}
```

### Content components

Components that reference a single content-item (e.g. the Banner component) can use a convenient 
wrapper-class that looks up the content and passes it as a prop. See below.

To enable this, the property `wrapInContentComponent: true` has to be set on the component in the 
`componentDefinitions` prop. See `componentDefinitions` in the API section for more details.

#### Props

- `content` - `Object` raw content object that contains the content-item's fields and field-values. Any 
 references to other content-items (e.g. images) are serialized as JSON Pointers.
- `manageContentButton` - `React.Component` for placement and rendering of the [Manage Content Button](https://www.onehippo.org/library/concepts/component-development/render-manage-content-button.html)
 in preview mode in CMS.
- `pageModel` - `Object` full Page Model API response.
- `preview` - `Boolean` is *true* if preview is active based on current URL supplied through `request` 
 prop of `<CmsPage>`.

#### Example

```jsx
import React from 'react'

const content = this.props.content;
const manageContentButton = this.props.manageContentButton;

class Banner extends React.Component {
  render() {
    return (
      <div className="my-content-component">
        { manageContentButton && manageContentButton }
        { content.title && content.title }
      </div>)
  }
}
```

### Static CMS components

Static CMS components are components that are defined by developers / administrators and cannot be  
modified by users in the CMS. However, any content or site menus these components reference can be 
changed by users in the CMS.

Since `<RenderCmsComponent>` only renders container components (drag-and-drop components) by default, 
you have to specify two additional properties in order to render a static CMS component: the `path` 
property to point to the relative path of the component, and `renderComponent` to specify which React 
component to use for rendering the component. See the example below.

```jsx
<RenderCmsComponent path={'menu'} renderComponent={CmsMenu} />
```

### Containers

Containers are being used to hold container items, which will be rendered by the SDK. Whenever it needs to customize a layout of those container items, it is possible also to pass a custom container component in `componentDefinitions`.

#### Example
```jsx
import React from 'react'
import { CmsPage, RenderCmsComponent } from 'bloomreach-experience-react-sdk'

function MyCustomFooter(props) {
  return (
    <footer>
      <div class="logo">...</div>
      { props.children }
      <div class="copyright">...</div>
    </footer>
  );
}

const componentDefinitions = {
  "Footer Container": { component: MyCustomFooter }
}

// ...

class MyApp extends React.Component {
  render() {
    return (
      <CmsPage componentDefinitions={componentDefinitions}>
        <RenderCmsComponent />
      </CmsPage>
    )
  }
}
```

### More component examples

For more detailed examples, see the components included in the [example applications](https://github.com/bloomreach/experience-react-sdk/tree/master/examples/client-side-rendered/src/components). 

### Helper functions

Additionally, there are a variety of helper functions available. See the examples below. For full 
details on the APIs, see the API section.

```jsx
import { createLink, getImageUrl, getNestedObject, parseAndRewriteLinks, parseDate } from 'bloomreach-experience-react-sdk'

const link = createLink('ref', link, linkText, className)
const image = getImageUrl(content.image, this.props.pageModel, this.props.preview)
const list = getNestedObject(configuration, ['models', 'pageable', 'items', 0])
const contentHtml = parseAndRewriteLinks(content.content.value, this.props.preview)
const date = parseDate(content.date)
```

## API

### `<CmsPage>`

The CmsPage component is a higher-order component that takes care of:
- Fetching the Page Model for client-side rendering, when not supplied as a prop.
- Fetching Page Model updates on component changes in the CMS.
- Initializing and managing state, and providing this as context to `<RenderCmsComponent>`.

#### Properties

- `cmsUrls` - `Object` Override default CMS URL's. (Optional)
- `componentDefinitions` - `object` Mapping of CMS catalog components to React components. Determines 
 what component to render based from the Page Model. (Optional)
- `createLink` - `Function` Called when creating internal links so that links can be constructed using 
 the router library of the React app. (Optional)
- `pageModel` - `Object` Supply Page Model as prop. Used for server-side-rendering where Page Model API 
 is fetched server-side. When supplied, `CmsPage` will not fetch Page Model API on mount, only on 
 component updates in CMS. (Optional)
- `request` - `String` Current URL-path for determining if preview mode is active, and for fetching the 
 Page Model for the page that is active. (Required)

###### `cmsUrls` property

Property that allows you to override the default URL's for fetching the Page Model API. Typically you 
will only have to define `scheme`, `hostname`, `port`, and `contextPath`. Input object takes the 
following properties (all are optional):
- `scheme` - `String` scheme (default: *http*)
- `hostname` - `String` hostname (default: *localhost*)
- `port` - `number` port number (default: *8080*)
- `contextPath` - `String` site context-path (default: *site*)
- `channelPath` - `String` path to the used channel, if channel is accessed through a subpath
- `previewPrefix` - `String` preview-prefix used by CMS (default: *_cmsinternal*)
- `apiPath` - `String` path to Page Model API as subpath (default: *resourceapi*)
- `apiComponentRenderingUrlSuffix` - `String` (default: *?_hn:type=component-rendering&_hn:ref=*)

###### `componentDefinitions` property

Maps CMS catalog components to React components. Expects as input an object with `hst:label` of the CMS 
components as keys and as value another object. The nested object has the mandatory property `component` 
who's value maps the CMS component to a React component. See the example below:

```js
const componentDefinitions = {
  "MyCustomCmsComponent": { component: MyCustomReactComponent },
  "AnotherCmsComponent": { component: AnotherReactComponent, wrapInContentComponent: true }
};
```

Additionally, the property `wrapInContentComponent: true` can be used for components that reference a 
single content-item. When this property is set on a component, it will be wrapped in a convenient 
wrapper class. See section *Content components*.

##### `createLink` property

Called when creating internal links so that links can be constructed using the router library of the 
React app. 

Takes `Function` as input. The function should return valid JSX and have three parameters:
- `href` - `String` href of link
- `linkText` - `Function` contains the HTML that is wrapped inside the link. Is a function so that it 
 can include HTML.
- `className` - `String` classnames to add to the link element

For example:
```jsx
const createLink = (href, linkText, className) => {
  return (<Link className={className} to={href}>{linkText()}</Link>)
}
```

##### `pageModel` property

Page Model can be supplied as a prop when using a server-side rendered / isomorphic React framework. 
When supplied, `<CmsPage>` will not fetch the Page Model API client-side. 

##### `request` property

Takes `Object` as input with properties `hostname` and `path`, both of type `String`. The property 
`hostname` should contain the hostname for the current request (client-side this is 
window.location.hostname). The property `path` should contain the URL-path for the current request 
(client-side this is window.location.pathname);

### `<RenderCmsComponent>`

Renders a CMS component and all of its children using the Page Model supplied by `<CmsPage>`. Will 
render the entire Page Model by default.

#### Properties

- `path` - `String` path to a component (static CMS component), container or container-item in the Page 
 Model to render only that component and its children. If no path is supplied, entire Page Model will be 
 rendered. 
- `renderComponent` - `React.Component` render a static CMS component using specified React component. 
 Only works in combination with `path` property, which should specify path to the static CMS component. 
 Site menus that are rendered this way can leverage the `<CmsEditButton>` component for rendering edit 
 buttons in the CMS.

#### Example

```jsx
<RenderCmsComponent path={'menu'} renderComponent={CmsMenu} />
```

### `<CmsEditButton>`

Inserts meta-data for either a content-item or site menu for placing an edit button in preview mode in 
the CMS. Content-items that are rendered by a content component using `wrapInContentComponent: true` do 
not need to use this component, but should use the `manageContentButton` prop that passes the meta-data.

#### Properties

- `configuration` - `Object` configuration of the site menu (not the component configuration containing 
the menu) or the content-item object which has the `_meta` object in its root.
- `preview` - `Boolean` toggle to prevent edit buttons from being rendered outside of preview.

### `getApiUrl(request, [newCmsUrls])`

Helper function for generating URL to the Page Model API for server-side fetching of the Page Model. 

#### Arguments

- `request` - `Object` containing hostname and URL-path as properties `hostname` and `path` 
 respectively. See the `request` property section above.
- `newCmsUrls` - `Object` takes `cmsUrls` property as input to override default CMS URL's

#### Return types

`String` returns URL for fetching Page Model API

### `createLink(linkType, link, linkText, className)`

Creates a link to either a component or content-item itself or a referenced content-item (can be a 
document, image or asset) and returns the link as JSX.  

#### Arguments

- `linkType` - `String` type of link to create. Valid values are `self`, `ref` or `href`.
  - `self` - Create link to the component or content-item itself. E.g. for a news-item in a news 
   overview.
  - `ref` - Create link to a referenced content-item. E.g. for a banner.
  - `href` -  Used by `parseAndRewriteLinks()` to create links using a href only.
- `link` - `Object` the component configuration or content-object that is linking to itself or 
 referenced another content-item.
- `linkText` - `JSX | Function` HTML to wrap inside the link. Is a function so that it can include HTML.
- `className` - `String` classnames to add to the link element

#### Return types

`JSX` returns link as JSX object that can be included as a variable anywhere within the return section 
of a React component's render method.

### `getImageUrl(imageRef, pageModel, preview)`

Creates link to URL of image in case BloomReach Experience is used for serving images.

#### Arguments

- `imageRef` - `String` JSON Pointer that references the image.
- `pageModel` - `Object` since this function is a pure JavaScript function it can't get Page Model from 
 context, so it has to be provided as function parameter. The Page Model is used to retrieve the image.
- `preview` - `Boolean` toggle for whether preview mode is active. Components rendered by 
 `<RenderCmsComponent>` can pass the prop `this.props.preview`.

#### Return types

`String` returns URL to image.

### `getNestedObject(nestedObject, pathArray)`

Returns a nested object or value using a path array. Useful when you need to access deeply nested 
objects/values without having to string null checks together.

#### Arguments

- `nestedObject` - `Object` the object containing the nested object or value.
- `pathArray` - `Array` contains the path to the nested object as an array.

#### Return types

`Object|null` returns the nested object if found, otherwise returns null. 

### `parseAndRewriteLinks(html, preview)`

Parses HTML of a rich-text field of a content-item for rewriting links in HTML to internal links. Uses 
the `createLink` function passed to `<CmsPage>` for constructing internal links.

#### Arguments

- `html` - `String` value of rich-text field of a content-item. Should contain HTML only.
- `preview` - `Boolean` toggle for whether preview mode is active. Components rendered by 
 `<RenderCmsComponent>` can pass the prop `this.props.preview`.

#### Return types

`JSX` returns parsed and rewrited HTML as JSX.

### `parseDate(date)`

Parses date-field of a content item and returns date as a string.

#### Arguments

- `date` - `String` takes raw value of a date-field as input, following the ISO 8601:2000 format.

#### Return types

`String` returns date in full date format.

## Release notes

### Version 0.6.4
- Fix bug in the object type check in the `findChildById` function.

### Version 0.6.3
- Add support of fully-qualified resource links.

### Version 0.6.2
- Fixed page model fetch on the component update.

### Version 0.6.1
- Fixed a bug with query string passing to the Page Model API.
- Fixed a bug with missing key prop in the link rewriter.

### Version 0.6.0
- Added eslint.
- Migrated to rollup.
- Migrated to yarn.
- Fixed CmsPage children to not be wrapped around a function.
- Added support of custom React components for container components.

### Version 0.5.2
- Fixed bug with query string affecting on the path parsing.

### Version 0.5.1
- Fixed bug with preview update on the component properties dialog changes;
- Fixed bug with preview update on save/discard changes from the component properties dialog;
- Fixed bug with the manage content button keeps referring to the old content after saving changes in the dialog.

### Version 0.5.0
- Fixed bug with SSO handshake in client-side rendered applications.

Upgrade steps:
- Pass query string parameters along with other request details to `<CmsPage>`:
  ```jsx
  const request = { hostname: window.location.hostname, path: window.location.path + window.location.search };
  <CmsPage componentDefinitions={componentDefinitions} request={request}>
  ```

### Version 0.4.0

Added support for rendering static CMS components.
- Added new property `renderComponent` to `<RenderCmsComponent>` which allows you to render a static 
 component. This only works in combination with the `path` property, which should contain the relative 
 path to the component.
- Renamed `<ManageContentButton>` to `<CmsEditButton>` and exported it so it can be used by apps. This 
 component is now more generic so it can also be used to generate edit buttons in the CMS for site menus.
- Moved `<CmsMenu>` component out of SDK and into the example apps.


### Version 0.3.0

Added extra checks so that `<div>` elements needed for CMS preview are only inserted in preview mode.

### Version 0.2.0

This version includes significant changes. Please make sure to update your components using the upgrade 
steps further down.
- Changed `cmsUrls` property to support different live and preview URLs.
- Changed `urlPath` property to `request` property which no longer takes URL-path as string, but an 
 object with hostname and URL-path. This property should be passed to `<CmsPage>`.
- Changed helper method `getApiUrl()` to take `request` property as parameter instead of `urlPath`.
- Changed helper method `parseAndRewriteLinks()` to take an extra parameter: `preview`.
- Changed helper method `getImageUrl()` to take an extra parameter: `preview`.

Upgrade steps:
- Modify `cmsUrls` property to include URLs for live and preview using the properties `live` and 
 `preview` respectively. Please note that the `cms` prefix has been removed from all URL properties. So `cmsHostname` has become `hostname`. Preview URLs are optional. For example:
  ```js
  const cmsUrls = {
    live: {
      hostname: bloomreach.com
    },
    preview: {
      hostname: cms.bloomreach.com
    }
  }
  ```
- Pass current request details through `request` property to `<CmsPage>`. This was previously done 
 through the `urlPath` property. The `request` property should be an object that contains the hostname 
 and path as properties `hostname` and `path` respectively. For example:
  ```jsx
  const request = { hostname: window.location.hostname, path: window.location.path };
  <CmsPage componentDefinitions={componentDefinitions} request={request}>
  ```
- Update usage of `getApiUrl` to pass `request` property (see previous bullet) instead of URL-path.
- Update usage of helper methods `getImageUrl()` and `parseAndRewriteLinks()` to include the preview 
 parameter. Components rendered by `<RenderCmsComponent>` have the preview value passed as prop 
 `this.props.preview`.

## FAQ / Troubleshooting

- Information about common problems and possible solutions can be found on [the troubleshooting page](https://documentation.bloomreach.com/library/concepts/spa-plus/sdk/spa-sdk-troubleshooting.html).
- Information about the recommended setup can be found on [the best practices page](https://documentation.bloomreach.com/library/concepts/spa-plus/sdk/spa-sdk-best-practices.html).

## License

Apache 2.0
