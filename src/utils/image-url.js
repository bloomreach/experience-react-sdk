import globalCmsUrls from './cms-urls';
import jsonpointer from 'jsonpointer';
import getNestedObject from './get-nested-object';

export function getImageUrl(imageRef, pageModel, preview, variant) {
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
  if (variant && getNestedObject(image, [variant])) {
    imageUrl = getNestedObject(image, [variant, '_links', 'site', 'href']);
  } else {
    imageUrl = getNestedObject(image, ['_links', 'site', 'href']);
  }
  if (imageUrl) {
    if (preview) {
      imageUrl = globalCmsUrls.preview.baseUrl + imageUrl;
    } else {
      imageUrl = globalCmsUrls.live.baseUrl + imageUrl;
    }
  }

  return imageUrl;
}

export function getImageUrlByPath(imagePath, variant, preview) {
  const cmsUrls = preview ? globalCmsUrls.preview : globalCmsUrls.live;
  
  let imageUrl = cmsUrls.baseUrl;

  if (cmsUrls.contextPath) {
    imageUrl += '/' + cmsUrls.contextPath;
  }

  imageUrl += '/binaries';
  
  if (variant) {
    imageUrl += '/' + variant
  }

  imageUrl += imagePath;

  return imageUrl;
}