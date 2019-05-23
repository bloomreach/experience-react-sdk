import { updateCmsUrls } from './cms-urls';
import parseRequest from './parse-request';
import { buildApiUrl } from './fetch';

export default function getApiUrl(request, newCmsUrls = {}) {
  const cmsUrls = updateCmsUrls(newCmsUrls);
  const parsedRequest = parseRequest(request, cmsUrls);

  return buildApiUrl(parsedRequest.path, parsedRequest.query, parsedRequest.preview, null, cmsUrls);
}