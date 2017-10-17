import React, { Component } from 'react';
import List from 'react-toolbox/lib/list/List';
import ListItem from 'react-toolbox/lib/list/ListItem';
import ListSubHeader from 'react-toolbox/lib/list/ListSubHeader';
import { sortObjects } from './utils';
import './Tags.css';
import PropTypes from 'prop-types'


class Tags extends Component {

  handleClickTag(tag) {
    this.props.onClickTag(tag);
  }

  renderTags() {
    
    const { tags } = this.props;

    if (tags == null) {
      return (
        <div className='Tags-loading'>
          Loading...
        </div>
      );
    }

    const sortedTags = sortObjects(tags, 'name');

    return (
      <List selectable ripple>
        <ListSubHeader caption='Tags' />
        {sortedTags.map((tag, index) =>
          <ListItem
            key={index}
            caption={tag.name}
            onClick={this.handleClickTag.bind(this, tag)}
          />
        )}
      </List>
    );
  }

  render() {
    return (
      <div className='Tags'>
        {this.renderTags()}
      </div>
    );
  }
}
Tags.propTypes = {
  onClickTag: PropTypes.func.isRequired,
  tags: PropTypes.array
}

export default Tags;
