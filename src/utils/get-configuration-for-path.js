import getNestedObject from './get-nested-object';

export default function getConfigurationForPath(path, pageModel) {
  const pathSegments = path.split('/');
  let currPath;

  let configuration = pageModel.page;
  while (getNestedObject(configuration, ['components', 0])) {
    // match the next path segment
    currPath = pathSegments.shift();

    configuration = getConfigurationForPathSegment(currPath, configuration);

    if (configuration && pathSegments.length === 0) {
      // this was the last path segment and we retrieved configuration, so we can return the configuration
      return configuration;
    }
  }
  return null;
}

function getConfigurationForPathSegment(pathSegment, configuration) {
  for (let componentIdx in configuration.components) {
    const component = configuration.components[componentIdx];
    // asterisk serves as a wildcard
    if (pathSegment === component.name || pathSegment === '*') {
      return component;
    }
  }
  return null;
}