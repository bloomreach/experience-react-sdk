import React from 'react';
import CmsContainer from './container';

export default class CmsComponent extends React.Component {
  renderComponentWrapper(configuration) {
    // based on the name of the container, render a different wrapper
    switch (configuration.name) {
      // add additional cases here if you need custom HTML wrapped around any of the components
      default:
        return (
          <React.Fragment>
            { this.renderComponent(configuration) }
          </React.Fragment>
        );
    }
  }

  renderComponent(configuration = { components: [] }) {
    // render all of the nested components
    if (configuration.components && configuration.components.length > 0) {
      return configuration.components.map((component) => {
        if (component.type === 'CONTAINER_COMPONENT') {
          // render container
          return (
            <CmsContainer configuration={component} key={component.id}/>
          );
        } else {
          // render regular component
          return (
            <CmsComponent configuration={component} key={component.id}/>
          );
        }
      });
    }
  }

  render() {
    if (!this.props.configuration) {
      return null;
    }

    return (
      <React.Fragment>
        { this.renderComponentWrapper(this.props.configuration) }
      </React.Fragment>
    );
  }
}