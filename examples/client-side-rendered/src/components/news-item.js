import React from 'react';
import { createLink, parseDate } from 'bloomreach-experience-react-sdk';

export default class NewsItem extends React.Component {
  render () {
    const content = this.props.content;
    const manageContentButton = this.props.manageContentButton;
    // createLink takes linkText as a function so that it can contain HTML elements
    const linkText = () => { return content.title };

    return (
      <div className="blog-post has-edit-button">
        { manageContentButton && manageContentButton }
        <h2 className="blog-post-title">
          { createLink('self', content, linkText, null) }
        </h2>
        <p className="blog-post-meta">
          { content.date &&
            <span className="blog-post-date">{parseDate(content.date)}</span>
          }
          { content.author &&
            <span className="author">{content.author}</span>
          }
        </p>
        { content.introduction &&
          <p>{content.introduction}</p>
        }
      </div>
    );
  }
}