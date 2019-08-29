# Example client-side React App

Example client-side React app using the BloomReach Experience SDK for React. The app is created using [create-react-app](https://github.com/facebook/create-react-app).

## Install and run

First, download and install the [BloomReach SPA demo project](https://github.com/onehippo/hippo-demo-spa-integration)
by following the instructions in the *Build Demo CMS project* section of the above link. Then run it by following the 
instructions in *Run Demo CMS project*.

Next, install the [UrlRewriter](https://documentation.bloomreach.com/library/enterprise/enterprise-features/url-rewriter/installation.html).

Then, customize `.env` file to contain a correct [PUBLIC_URL](https://create-react-app.dev/docs/using-the-public-folder) path, for example:
```
PUBLIC_URL=http://localhost:3000
```

Beware of [this issue](https://github.com/facebook/create-react-app/pull/7259). The PUBLIC_URL may not work in development mode.

Finally, build and run the React app as followed:

```bash
npm install
npm run start
```

The CMS should now be accessible at <http://localhost:8080/cms>, and it should render the client-side React app in preview
mode in the Channel Manager. The SPA itself can be accessed directly via <http://localhost:3000>.
