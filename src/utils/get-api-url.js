import { updateCmsUrls } from './cms-urls';
import parseUrlPath from './parse-url';
import { buildApiUrl } from './fetch';

export default function getApiUrl(urlPath, newCmsUrls={}) {
  const cmsUrls = updateCmsUrls(newCmsUrls);
  const parsedUrl = parseUrlPath(urlPath, cmsUrls);
  return buildApiUrl(parsedUrl.path, parsedUrl.preview, null, cmsUrls);
}