# Example server-side React App

Example server-side React app using the BloomReach Experience SDK for React. The app uses [Next.js](https://github.com/zeit/next.js)
as framework for creating a server-side rendered app.

## Install and run

First, download and install the [BloomReach SPA demo project](https://github.com/onehippo/hippo-demo-spa-integration)
by following the instructions in the *Build Demo CMS project* section of the above link. Then run it by following the 
instructions in *Run Demo CMS project*.

Next, install the [UrlRewriter](https://documentation.bloomreach.com/library/enterprise/enterprise-features/url-rewriter/installation.html).

Then, customize `.env` file to contain a correct PUBLIC_URL path, for example:
```
PUBLIC_URL=http://localhost:3000
```

In the same `.env` file, also specify the brXM instance to fetch the page model from. The default configuration 
connects to `http://localhost:8080/site/`:

```
BR_ORIGIN=http://localhost:8080
BR_CONTEXT_PATH=site
BR_CHANNEL_PATH=
```

Finally, build and run the React app as followed:

```bash
yarn
yarn run dev
```

The CMS should now be accessible at <http://localhost:8080/cms>, and it should render the server-side React app in preview
mode in the Channel Manager. The SPA itself can be accessed directly via <http://localhost:3000>.
