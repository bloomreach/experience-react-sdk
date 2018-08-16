# BloomReach Experience SDK for React

SDK for powering content and components in React applications by [BloomReach Experience](https://www.bloomreach.com/en/products/experience). 
This library makes integrating a React app with BloomReach Experience a breeze. It supports both client-side- and 
server-side rendered/isomorphic React apps. 

BloomReach Experience allows you to use an external front-end such as React for rendering while still providing a 
native-like authoring experience, such as integrated preview, in-context editing, drag & drop, server-side 
personalization. For more information on this approach, see [A new approach to integrating SPA's with WCM: Fixing what's 
wrong with headless integrations](https://www.bloomreach.com/en/blog/2018/03/a-new-approach-to-integrating-spas-with-wcm-fixing-what%E2%80%99s-wrong-with-headless-integrations.html).

## Install

```bash
npm install bloomreach-experience-react-sdk --save
```

## Usage

```js
import React from 'react'
import { CmsPage, RenderCmsComponent } from 'bloomreach-experience-react-sdk'

const componentDefinitions = {
  "MyCustomComponent": { component: MyCustomComponent }
}

class MyApp extends React.Component {
  render() {
    const currentUrl = window.location.pathname
    return (
      <CmsPage componentDefinitions={componentDefinitions} url={currentUrl}>
        { () =>
          <RenderCmsComponent />
        }
      </CmsPage>
    )
  }
}
```

At a minimum, `<CmsPage>` and `<RenderCmsComponent>` should be imported.

`<CmsPage>` fetches the Page Model if it is not supplied as a prop (see section on server-side rendering); it fetches 
updates on component changes in the CMS; and it initializes and manages state, and provides this as context to 
`<RenderCmsComponent>`.

`<RenderCmsComponent>` renders components based on the Page Model API response.

The `<CmsPage>` component can be put anywhere within a React App. It functions as a higher-order component (HOC). 
`<RenderCmsComponent>` consumes the state from `<CmsPage>` and renders the components and any content referenced from the 
components as contained in the Page Model API response. The `<RenderCmsComponent>` should be placed in the React app at 
the exact location where you want BloomReach Experience to render its components.

Please note that `<CmsPage>` takes children as a function instead of as a prop, because it is otherwise not possible to 
provide state through context providers due to a bug in React currently. So make sure to wrap any children of 
`<CmsPage>` in a function, as in the following example:

 ```js
{ () =>
  // any children go here
  <h1>Blooming is what I do</h1>
}
 ```

`<CmsPage>` takes two props: `componentDefinitions` and `urlPath`.

The `urlPath` prop is used to fetch the Page Model for the page that is active; and to detect whether preview is active 
so that meta-data for Channel Manager functionality (e.g. in-context editing) is included in the HTML, and consequently 
Channel Manager functionality is enabled.

Finally, component definitions are supplied through the `componentDefinitions` prop. The component definitions tell 
`<RenderCmsComponent>` what React component to render by mapping these to the *hst:label* of a CMS catalog component.

## Server-side rendering

For server-side rendering (e.g. using [Next.js](https://github.com/zeit/next.js)) you need to fetch the Page Model API 
server-side and supply it as a prop to `<CmsPage>`. Apart from this the usage is the same as with client-side rendering.

The helper function `getApiUrl()` can be used to generate the Page Model API URL using the current URL.

It is important to pass cookies from the initial request and supply these with the request header of the Page 
Model API request. Otherwise you will get a 403 error in preview mode.

Finally, to get preview to work for server-side rendered apps you can use a reverse proxy to route requests from 
BloomReach's site preview to the React App-server. For more details, see section *3.2 Server-side apps* of the Hippo Lab: 
[Integrate a React application with BloomReach Experience](https://www.onehippo.org/labs/integrate-a-react-application-with-bloomreach-experience.html).

```js
import fetch from 'isomorphic-unfetch'
import { getApiUrl, CmsPage, RenderCmsComponent } from 'bloomreach-experience-react-sdk'

// setting pageModel to empty list instead of null value,
// as otherwise the API will be fetched client-side again after server-side fetch errors
let pageModel = {}

const url = getApiUrl(asPath, {})
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

There are two example React apps available that use the SDK. One client-side rendered, and one server-side rendered 
using [Next.js](https://github.com/zeit/next.js). You can find the [example apps on Github](https://github.com/bloomreach/experience-react-sdk/tree/master/examples).

## Creating custom components

Any components that are supplied through the `compenentDefinitions` prop can be any type of valid React component, 
including functional components. Props are passed to these components as context so that you can access the components' 
configuration, content, etc. See more information below.

### Props

The following props are passed to a component that is rendered by `<RenderCmsComponent>`:
- `configuration` - `Object` component configuration. Contains the contributed models, raw parameters and resolved 
 parameters. Content included in the component's model is not serialized as part of the component's configuration but in 
 a separate content object, and a JSON Pointer reference is used to link to the actual content object. This is done to 
 prevent content from being included multiple times in the API response when referenced multiple times. 
- `pageModel` - `Object` full Page Model API response.
- `preview` - `Boolean` is *true* if preview is active based on current URL supplied through `urlPath` prop of 
`<CmsPage>`.

For more information on the Page Model API response, see the [Swagger documentation](https://www.onehippo.org/library/concepts/spa-plus/page-model-api/swagger-api-documentation.html).

### Example

```js
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

Components that reference a single content-item (e.g. the Banner component) can use a convenient wrapper-class that 
looks up the content and passes it as a prop. See below.

To enable this, the property `wrapInContentComponent: true` has to be set on the component in the `componentDefinitions` 
prop. See `componentDefinitions` in the API section for more details.

#### Props

- `content` - `Object` raw content object that contains the content-item's fields and field-values. Any references to 
 other content-items (e.g. images) are serialized as JSON Pointers.
- `manageContentButton` - `React.Component` for placement and rendering of the [Manage Content Button](https://www.onehippo.org/library/concepts/component-development/render-manage-content-button.html)
 in preview mode in CMS.
- `pageModel` - `Object` full Page Model API response.
- `preview` - `Boolean` is *true* if preview is active based on current URL supplied through `urlPath` prop of 
`<CmsPage>`.

#### Example

```js
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

### More component examples

For more detailed examples, see the components included in the [example applications](https://github.com/bloomreach/experience-react-sdk/tree/master/examples/client-side-rendered/src/components). 

### Helper functions

Additionally, there are a variety of helper functions available. See the examples below. For full details on the APIs, 
see the API section.

```js
import { createLink, getImageUrl, getNestedObject, parseAndRewriteLinks, parseDate } from 'bloomreach-experience-react-sdk'

const link = createLink('ref', link, linkText, className)
const image = getImageUrl(content.image, this.props.pageModel)
const list = getNestedObject(configuration, ['models', 'pageable', 'items', 0])
const contentHtml = parseAndRewriteLinks(content.content.value)
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
- `componentDefinitions` - `object` Mapping of CMS catalog components to React components. Determines what 
component to render based from the Page Model. (Optional)
- `createLink` - `Function` Called when creating internal links so that links can be constructed using the router 
library of the React app. (Optional)
- `pageModel` - `Object` Supply Page Model as prop. Used for server-side-rendering where Page Model API is fetched 
server-side. When supplied, `CmsPage` will not fetch Page Model API on mount, only on component updates in CMS.
(Optional)
- `urlPath` - `String` Current URL-path for determining if preview mode is active, and for fetching the Page Model for 
the page that is active. (Required)

###### `cmsUrls` property

Property that allows you to override the default URL's for fetching the Page Model API. Typically you will only have to 
define `cmsScheme`, `cmsHostname`, `cmsPort`, and `cmsContextPath`. Input object takes the following properties (all are 
optional):
- `cmsScheme` - `String` scheme (default: *http*)
- `cmsHostName` - `String` hostname (default: *localhost*)
- `cmsPort` - `number` port number (default: *8080*)
- `cmsContextPath` - `String` site context-path (default: *site*)
- `cmsChannelPath` - `String` path to the used channel, if channel is accessed through a subpath
- `cmsPreviewPrefix` - `String` preview-prefix used by CMS (default: *_cmsinternal*)
- `cmsApiPath` - `String` path to Page Model API as subpath (default: *resourceapi*)
- `cmsApiComponentRenderingUrlSuffix` - `String` (default: *?_hn:type=component-rendering&_hn:ref=*)

###### `componentDefinitions` property

Maps CMS catalog components to React components. Expects as input an object with `hst:label` of the CMS components as 
keys and as value another object. The nested object has the mandatory property `component` who's value maps the CMS 
component to a React component. See the example below:

```js
const componentDefinitions = {
  "MyCustomCmsComponent": { component: MyCustomReactComponent },
  "AnotherCmsComponent": { component: AnotherReactComponent, wrapInContentComponent: true }
};
```

Additionally, the property `wrapInContentComponent: true` can be used for components 
that reference a single content-item. When this property is set on a component, it will be wrapped in a convenient 
wrapper class. See section *Content components*.

##### `createLink` property

Called when creating internal links so that links can be constructed using the router 
library of the React app. 

Takes `Function` as input. The function should return valid JSX and have three parameters:
- `href` - `String` href of link
- `linkText` - `Function` contains the HTML that is wrapped inside the link. Is a function so that it can include HTML.
- `className` - `String` classnames to add to the link element

For example:
```js
const createLink = (href, linkText, className) => {
  return (<Link className={className} to={href}>{linkText()}</Link>)
}
```

##### `pageModel` property

Page Model can be supplied as a prop when using a server-side rendered / isomorphic React framework. When supplied, 
`<CmsPage>` will not fetch the Page Model API client-side. 

##### `urlPath` property

Takes `String` as input. Should only contain the URL-path (everything that comes after the hostname or domain name).

### `<RenderCmsComponent>`

Renders a CMS component and all of its children using the Page Model supplied by `<CmsPage>`. Will render the entire 
Page Model by default.

#### Properties

- `path` - `String` path to a component (static CMS component), container or container-item in the Page Model to render 
only that component and its children. If no path is supplied, entire Page Model will be rendered. 

#### Example

```js
<RenderCmsComponent path={'main/container/banner'}/>
```

### `getApiUrl(urlPath, [newCmsUrls])`

Helper function for generating URL to the Page Model API for server-side fetching of the Page Model. 

#### Arguments

- `urlPath` - `String` URL-path (everything that comes after the hostname or domain name).
- `newCmsUrls` - `Object` takes `cmsUrls` property as input to override default CMS URL's

#### Return types

`String` returns URL for fetching Page Model API

### `createLink(linkType, link, linkText, className)`

Creates a link to either a component or content-item itself or a referenced content-item (can be a document, image or 
asset) and returns the link as JSX.  

#### Arguments

- `linkType` - `String` type of link to create. Valid values are `self`, `ref` or `href`.
  - `self` - Create link to the component or content-item itself. E.g. for a news-item in a news overview.
  - `ref` - Create link to a referenced content-item. E.g. for a banner.
  - `href` -  Used by `parseAndRewriteLinks()` to create links using a href only.
- `link` - `Object` the component configuration or content-object that is linking to itself or referenced another 
content-item.
- `linkText` - `JSX | Function` HTML to wrap inside the link. Is a function so that it can include HTML.
- `className` - `String` classnames to add to the link element

#### Return types

`JSX` returns link as JSX object that can be included as a variable anywhere within the return section of a React 
component's render method.

### `getImageUrl(imageRef, pageModel)`

Creates link to URL of image in case BloomReach Experience is used for serving images.

#### Arguments

- `imageRef` - `String` JSON Pointer that references the image.
- `pageModel` - `Object` since this function is a pure JavaScript function it can't get Page Model from context, so it 
has to be provided as function parameter. The Page Model is used to retrieve the image.

#### Return types

`String` returns URL to image.

### `getNestedObject(nestedObject, pathArray)`

Returns a nested object or value using a path array. Useful when you need to access deeply nested objects/values without
having to string null checks together.

#### Arguments

- `nestedObject` - `Object` the object containing the nested object or value.
- `pathArray` - `Array` contains the path to the nested object as an array.

#### Return types

`Object|null` returns the nested object if found, otherwise returns null. 

### `parseAndRewriteLinks(html)`

Parses HTML of a rich-text field of a content-item for rewriting links in HTML to internal links. Uses the `createLink` 
function passed to `<CmsPage>` for constructing internal links.

#### Arguments

- `html` - `String` value of rich-text field of a content-item. Should contain HTML only.

#### Return types

`JSX` returns parsed and rewrited HTML as JSX.

### `parseDate(date)`

Parses date-field of a content item and returns date as a string.

#### Arguments

- `date` - `String` takes raw value of a date-field as input, following the ISO 8601:2000 format.

#### Return types

`String` returns date in full date format.

## FAQ / Troubleshooting

Nothing here yet :)

## Author

Robbert Kauffman - BloomReach
