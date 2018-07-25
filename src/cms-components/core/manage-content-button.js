import React from 'react';
import { addBeginComment } from '../../utils/add-html-comment';

export default class ManageContentButton extends React.Component {
  addButton(htmlElm, configuration, preview) {
    addBeginComment(htmlElm, 'afterbegin', configuration, preview);
  }

  render() {
    const content = this.props.content;
    const preview = this.props.preview;

    return (
      <div style={{ position: 'relative' }}>
        <span ref={(editContentElm) => { this.addButton(editContentElm, content, preview); }}/>
      </div>
    );
  }
}