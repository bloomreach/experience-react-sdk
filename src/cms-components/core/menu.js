import React from 'react';
import createLink from '../../utils/create-link';
import getNestedObject from '../../utils/get-nested-object';

export default class CmsMenu extends React.Component {
  renderMenu(configuration, pageModel) {
    return configuration.models.menu.siteMenuItems.map((menuItem) => {
      return (
        <CmsMenuItem configuration={menuItem} key={menuItem.name} />
      )
    });
  }

  render() {
    const configuration = this.props.configuration;

    if (!getNestedObject(configuration, ['models', 'menu', 'siteMenuItems', 0])) {
      return null;
    }

    return (
      <ul className="navbar-nav mr-auto">
        { this.renderMenu(configuration, this.props.pageModel) }
      </ul>
    );
  }
}

class CmsMenuItem extends React.Component {
  render() {
    const configuration = this.props.configuration;

    if (!configuration) {
      return null;
    }

    const activeElm = configuration.selected ? (<span className="sr-only">(current)</span>) : null;
    // createLink takes linkText as a function so that it can contain HTML elements
    const linkText = () => { return (<React.Fragment>{configuration.name}{activeElm}</React.Fragment>)};
    const className = 'nav-link';

    return (
      <li className="nav-item">
        { createLink('self', configuration, linkText, className) }
      </li>
    );
  }
}