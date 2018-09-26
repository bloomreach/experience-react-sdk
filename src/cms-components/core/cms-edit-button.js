import React from 'react';
import { addBeginComment } from '../../utils/add-html-comment';

export default class CmsEditButton extends React.Component {
  addButton(htmlElm, configuration, preview) {
    addBeginComment(htmlElm, 'afterbegin', configuration, preview);
  }

  render() {
    const { configuration, preview } = this.props;

    if (!preview) {
      return null;
    }

    return (
      <div style={{ position: 'relative' }}>
        <span ref={(editContentElm) => { this.addButton(editContentElm, configuration, preview); }}/>
      </div>
    );
  }
}