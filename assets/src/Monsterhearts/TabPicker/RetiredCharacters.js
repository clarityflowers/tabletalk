import React from 'react';
import { connect } from 'react-redux'
import BigTabList from './BigTabList';

import { 
  getCharacterTabs
} from 'Monsterhearts/selectors'

const mapStateToProps = (state, {depth}) => {
  const tabs = getCharacterTabs(state, {retired: true});
  return {tabs, depth};
};

const mapDispatchToProps = {}

const Component = (props) => (
  <BigTabList {...props} showNew={false}/>
)

export default connect(mapStateToProps, mapDispatchToProps)(Component);