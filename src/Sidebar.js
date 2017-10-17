import React, { Component } from 'react';
import Tags from './Tags'
import './Sidebar.css';
import Button from 'react-toolbox/lib/button/Button';
import PropTypes from 'prop-types'
class Sidebar extends Component {
  render() {
    return (
      <div className='Sidebar'>
        <Tags
          tags={this.props.tags}
          onClickTag={this.props.onClickTag}
        />
        <Button icon='add' label='Add New Tag' flat primary onClick={this.props.onClickNewTag}/>
      </div>
    );
  }
}
Sidebar.propTypes = {
  tags: PropTypes.array,
  onClickNewTag: PropTypes.func.isRequired,
  onClickTag: PropTypes.func.isRequired
}
export default Sidebar;
