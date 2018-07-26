# Example server-side React App

Example server-side React app using the BloomReach Experience SDK for React. The app uses [Next.js](https://github.com/zeit/next.js)
as framework for creating a server-side rendered app.

## Install and run

First, download and install the [BloomReach SPA demo project](https://github.com/onehippo/hippo-demo-spa-integration)
by following the instructions in the *Build Demo CMS project* section of the above link. Then run it by following the 
instructions in *Run Demo CMS project*.

Next, build and run the React app as followed:

```bash
npm install
npm run dev
```

To have the React app render the CMS site preview you will need to setup a reverse proxy. A [reverse proxy script for 
Node](https://github.com/woonsan/hippo7-rproxy-nodejs) is included with the example app. Install and run as followed:

```bash
cd rproxy
npm install
sudo node rproxy.js
```

After starting, make sure to enter your credentials as the reverse proxy needs superuser privileges to redirect the 
requests.

Finally, configure the CMS to point to the reverse proxy and update the CORS headers.

* Go to <http://localhost:8080/cms/console/?1&path=/hst:hst/hst:hosts/dev-localhost>
  * Change the property `hst:cmslocation` to `http://localhost/cms`
  * Remove the property `hst:defaultport`
* Go to <http://localhost:8080/cms/console/?1&path=/hst:hst/hst:hosts/dev-localhost/localhost/hst:root>
  * Change the first value of property `hst:responseheaders` to `Access-Control-Allow-Origin: http://localhost`

The CMS should now be accessible at <http://localhost/cms> and it should render the server-side React app in preview 
mode in the Channel Manager.
