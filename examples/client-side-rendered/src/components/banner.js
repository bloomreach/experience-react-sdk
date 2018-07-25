import React from 'react';
import { createLink, getImageUrl, parseAndRewriteLinks } from 'bloomreach-experience-react-sdk';

export default class Banner extends React.Component {
  render() {
    const content = this.props.content;
    const manageContentButton = this.props.manageContentButton;
    const image = getImageUrl(content.image, this.props.pageModel);

    let contentHtml;
    if (content.content && content.content.value) {
      contentHtml = parseAndRewriteLinks(content.content.value);
    }

    const link = content.link ? content.link['$ref'] : null;
    // createLink takes linkText as a function so that it can contain HTML elements
    const linkText = () => { return ('Learn more') };
    const className = 'btn btn-primary btn-lg';

    return (
      <div className="jumbotron has-edit-button">
        { manageContentButton && manageContentButton }
        { content.title &&
          <h1>{content.title}</h1>
        }
        { image &&
          <figure>
            <img src={image} alt={content.title}/>
          </figure>
        }
        { contentHtml && contentHtml }
        <p>
          { link && createLink('ref', link, linkText, className) }
        </p>
      </div>
    );
  }
}