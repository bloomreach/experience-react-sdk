import React from 'react';
import { addBeginComment } from '../../utils/add-html-comment';
import getNestedObject from '../../utils/get-nested-object';

export default class CmsEditButton extends React.Component {
  constructor(props) {
    super(props);

    this.placeholder = React.createRef();
  }

  addButton(htmlElm) {
    const { configuration, preview } = this.props;
    addBeginComment(htmlElm, 'afterbegin', configuration, preview);
  }

  shouldComponentUpdate(nextProps) {
    const path = ['_meta', 'beginNodeSpan', 0, 'data'];

    return getNestedObject(this.props.configuration, path) !== getNestedObject(nextProps.configuration, path);
  }

  componentDidMount() {
    if (!this.placeholder.current) {
      return;
    }

    this.addButton(this.placeholder.current);
  }

  componentDidUpdate() {
    const placeholder = this.placeholder.current;
    if (!placeholder) {
      return;
    }

    Array.from(placeholder.childNodes)
      .forEach(node => node.remove());
    placeholder.removeAttribute('class');
    this.addButton(placeholder);
  }

  render() {
    if (!this.props.preview) {
      return null;
    }

    return (
      <div style={{ position: 'relative' }}>
        <span ref={this.placeholder}/>
      </div>
    );
  }
}