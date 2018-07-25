import React from 'react';
import { getImageUrl, parseAndRewriteLinks, parseDate } from 'bloomreach-experience-react-sdk';

export default class Content extends React.Component {
  render() {
    const content = this.props.content;
    const manageContentButton = this.props.manageContentButton;
    const image = getImageUrl(content.image, this.props.pageModel);

    let contentHtml;
    if (content.content && content.content.value) {
      contentHtml = parseAndRewriteLinks(content.content.value);
    }

    return (
      <div className="blog-post has-edit-button">
        { manageContentButton && manageContentButton }
        <h2 className="blog-post-title">{content.title}</h2>
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
        { image &&
          <figure>
            <img src={image} alt={content.title}/>
          </figure>
        }
        { contentHtml && contentHtml }
      </div>
    );
  }
}