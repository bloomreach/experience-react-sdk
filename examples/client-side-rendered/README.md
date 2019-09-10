# Example client-side React App

Example client-side React app using the BloomReach Experience SDK for React. The app is created using [create-react-app](https://github.com/facebook/create-react-app).

## Install and run

First, download and install the [BloomReach SPA demo project](https://github.com/onehippo/hippo-demo-spa-integration)
by following the instructions in the *Build Demo CMS project* section of the above link. Then run it by following the 
instructions in *Run Demo CMS project*.

Next, install the [UrlRewriter](https://documentation.bloomreach.com/library/enterprise/enterprise-features/url-rewriter/installation.html)
and configure that according to [this document](https://documentation.bloomreach.com/library/concepts/spa-plus/url-rewriter-rules.html).

Then, customize `.env` file to contain a correct [PUBLIC_URL](https://create-react-app.dev/docs/using-the-public-folder) path, for example:
```
PUBLIC_URL=http://localhost:3000
```

Beware of [this issue](https://github.com/facebook/create-react-app/pull/7259). The PUBLIC_URL may not work in development mode.

In the same `.env` file, also specify the brXM instance to fetch the page model from. The default configuration 
connects to `http://localhost:8080/site/`:

```
REACT_APP_BR_ORIGIN=http://localhost:8080
REACT_APP_BR_CONTEXT_PATH=site
REACT_APP_BR_CHANNEL_PATH=
```

Finally, build and run the React app as follows:

```bash
yarn
yarn run dev
```

The CMS should now be accessible at <http://localhost:8080/cms>, and it should render the client-side React app in preview
mode in the Channel Manager. The SPA itself can be accessed directly via <http://localhost:3000>.
