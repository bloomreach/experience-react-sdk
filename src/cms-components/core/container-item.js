import React from 'react';
import ContentComponentWrapper from './content-component-wrapper';
import UndefinedComponent from './undefined';
import { addBeginComment, addEndComment } from '../../utils/add-html-comment';
import { ComponentDefinitionsContext, PageModelContext, PreviewContext } from '../../context';

export default class CmsContainerItem extends React.Component {
  renderContainerItem(component, pageModel, preview, componentDefinitions) {
    // based on the type of the component, render a different React component
    if (component.label in componentDefinitions) {
      if ('wrapInContentComponent' in componentDefinitions[component.label]
        && componentDefinitions[component.label]['wrapInContentComponent']) {
        // wrap component in ContentComponentWrapper class
        return (
          <ContentComponentWrapper configuration={component} pageModel={pageModel} preview={preview}
                                   componentDefinitions={componentDefinitions} />
        );
      } else if (componentDefinitions[component.label].component) {
        // component is defined and does not have to be wrapped in ContentComponent, so render the actual component
        const componentEl = React.createElement(componentDefinitions[component.label].component,
          { configuration: component, pageModel: pageModel, preview: preview,
            componentDefinitions: componentDefinitions}, null);
        return (componentEl);
      }
    } else {
      // component not defined in component-definitions
      return (
        <UndefinedComponent name={component.label} />
      );
    }
  }

  addMetaData(htmlElm, configuration, preview) {
    addBeginComment(htmlElm, 'afterbegin', configuration, preview);
    addEndComment(htmlElm, 'beforeend', configuration, preview);
  }

  render() {
    const configuration = this.props.configuration;

    return (
      <PageModelContext.Consumer>
        { pageModel =>
          <PreviewContext.Consumer>
            { preview =>
              <ComponentDefinitionsContext.Consumer>
                { componentDefinitions =>
                  <div className="hst-container-item"
                       ref={(containerItemElm) => { this.addMetaData(containerItemElm, configuration, preview); }}>
                    <React.Fragment>
                      { configuration &&
                        this.renderContainerItem(configuration, pageModel, preview, componentDefinitions)
                      }
                    </React.Fragment>
                  </div>
                }
              </ComponentDefinitionsContext.Consumer>
            }
          </PreviewContext.Consumer>
        }
      </PageModelContext.Consumer>
    );
  }
}