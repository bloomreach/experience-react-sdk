import React from 'react';
import { CmsEditButton, createLink, getNestedObject } from 'bloomreach-experience-react-sdk';

export default class CmsMenu extends React.Component {
  renderMenu(configuration) {
    return configuration.models.menu.siteMenuItems.map((menuItem) => {
      return <CmsMenuItem configuration={menuItem} key={menuItem.name} />;
    });
  }

  render() {
    const { configuration, preview } = this.props;

    if (!getNestedObject(configuration, ['models', 'menu', 'siteMenuItems', 0])) {
      return null;
    }

    const menuConfiguration = getNestedObject(configuration, ['models', 'menu']);
    const editButton = preview ? <CmsEditButton configuration={menuConfiguration} preview={preview} /> : null;

    return (
      <ul className="navbar-nav mr-auto">
        { editButton && editButton }
        { this.renderMenu(configuration) }
      </ul>
    );
  }
}

class CmsMenuItem extends React.Component {
  render() {
    const { configuration } = this.props;

    if (!configuration) {
      return null;
    }

    const activeElm = configuration.selected ? <span className="sr-only">(current)</span> : null;
    // createLink takes linkText as a function so that it can contain HTML elements
    const linkText = () => { return <React.Fragment>{configuration.name}{activeElm}</React.Fragment> };
    const className = 'nav-link';

    return (
      <li className="nav-item">
        { createLink('self', configuration, linkText, className) }
      </li>
    );
  }
}