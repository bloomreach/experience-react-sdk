import React from 'react';
import CmsComponent from './component';
import CmsContainer from './container';
import CmsContainerItem from './container-item';
import CmsMenu from './menu';
import { withPageModel } from '../../context';
import getConfigurationForPath from '../../utils/get-configuration-for-path';

class RenderCmsComponent extends React.Component {
  renderComponent(configuration) {
    switch (configuration.type) {
      case "CONTAINER_COMPONENT":
        return <CmsContainer configuration={configuration} />;
        break;
      case "CONTAINER_ITEM_COMPONENT":
        return <CmsContainerItem configuration={configuration} />;
        break;
      default:
        if (configuration.componentClass === "org.onehippo.cms7.essentials.components.EssentialsMenuComponent") {
          return <CmsMenu configuration={configuration}/>;
        } else {
          return <CmsComponent configuration={configuration}/>;
        }
    }
  }

  render() {
    let configuration;

    // render entire page if no path has been specified
    if (!this.props.path) {
      if (this.props.pageModel) {
        configuration = this.props.pageModel.page;
      } else {
        throw 'render-cms-component has no supplied page model';
        return null;
      }
    } else {
      // or lookup component configuration using supplied path
      configuration = getConfigurationForPath(this.props.path, this.props.pageModel);
    }

    if (!configuration) {
      return null;
    }

    return (
      <React.Fragment>
        { this.renderComponent(configuration) }
      </React.Fragment>
    );
  }
}

export default withPageModel(RenderCmsComponent);