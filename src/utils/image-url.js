import cmsUrls from './cms-urls';
import jsonpointer from 'jsonpointer';
import getNestedObject from './get-nested-object';

export default function getImageUrl(imageRef, pageModel) {
  // get image reference
  let imageUuid;
  if (imageRef || imageRef.$ref) {
    imageUuid = imageRef.$ref
  }

  // get serialized image via reference
  let image;
  if (imageUuid && (typeof imageUuid === 'string' || imageUuid instanceof String)) {
    image = jsonpointer.get(pageModel, imageUuid);
  }

  // build URL
  let imageUrl = null;
  if (getNestedObject(image, ['_links', 'site', 'href'])) {
    imageUrl = cmsUrls.cmsBaseUrl + image._links.site.href;
  }

  return imageUrl;
}