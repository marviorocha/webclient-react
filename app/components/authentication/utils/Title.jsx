
import React from 'react';

export default React.createClass({

  propTypes: {
    children: React.PropTypes.node,
  },

  render() {
    return (
      <div className="authentication__title">{this.props.children}</div>
    );
  },
});
