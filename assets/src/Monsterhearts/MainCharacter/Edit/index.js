import { connect } from 'react-redux'
import Edit from './Edit';
import { compose } from 'redux';
import withSize from 'common/withSize';

import { goBack, replace } from 'Routing/actionCreators';
import editDone from '../editDone';

const mapStateToProps = (state, {here, sizes}) => {
  const id = parseInt(here[2]);
  const { monsterhearts } = state;
  const { charactersById, playersById, me } = monsterhearts;
  const { mainCharacter } = charactersById[id];
  const { playerId } = mainCharacter;
  const readOnly = (playerId !== me) && !playersById[me].isGM;
  return {
    ...editDone(id, state),
    readOnly
  }
};

const mapDispatchToProps = {goBack, replace}

export default compose(
  connect(mapStateToProps, mapDispatchToProps)
)(Edit);