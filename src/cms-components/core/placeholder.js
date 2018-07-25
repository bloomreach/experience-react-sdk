import React from 'react';

export default class Placeholder extends React.Component {
  // placeholder component is used for when components data is not set
  // this is the case when a new component is added to a container
  render() {
    return (
      <p>Click to configure { this.props.name }</p>
    );
  }
}