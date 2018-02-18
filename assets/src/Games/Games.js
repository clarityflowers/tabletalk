import React from 'react';
import rx from 'resplendence';
import { string, bool, object, instanceOf, arrayOf, func } from 'prop-types';

import GameInfo from './GameInfo';
import GameListItem from './GameListItem';
import NewGameForm from './NewGameForm';
import Spinner from 'common/components/Spinner';

import { exactMatch } from 'utils/pathTools';
import expired from 'utils/expired';

rx`
@import "~common/styles";
@import "~common/colors";
`

const Container = rx('div')`
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  display: flex;
  align-items: flex-start;
  justify-content: center;
`

const Body = rx('div')`
  width: 100%;
  height: 100%;
  overflow: hidden;
  max-width: 800px;
  padding: 40px 40px 0px 40px;
  display: flex;
  flex-flow: column;
  &.under-max {
    padding: 0;
  }
`

const Title = rx('div')`
  @include card;
  background: $card-background-dark;
  color: $color-light;
  font-family: "Marvin Visions";
  font-size: 80px;
  margin: 10px 0;
  position: relative;
  text-align: center;
  &.under-max {
    margin: 0;
    padding: 12px 0 0 0;
  }
  &.narrow {
    font-size: 75px;
  }
  &.tiny {
    font-size: 55px;
  }
`

const ReturnButton = rx('button')`
  @include button;
  font-family: "Icomoon";
  position: absolute;
  display: block;
  top: 25px;
  left: 10px;
  color: $color-light;
  text-shadow: -1px 1px 1px hsla(0, 0%, 0%, 0.1);
  font-size: 40px;
  transform-properties: color, font-size, top, left;
  transform-duration: 0.15s;
  &:hover, &:focus {
    top: 22px;
    left: 7px;
    color: $link-hover;
    font-size: 46px;
  }
  &.narrow {
    top: 40px;
  }
`

const GamesList = rx('div')`
  display: flex;
  flex-flow: column;
  align-items: flex-start;
  padding: 20px;
  overflow-y: scroll;
  flex: 1 0 0;

  box-sizing: border-box;
  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    $background: fade-out($color-dark, 0.5);
    background-color: $background;
    background-clip: padding-box;
    border-radius: 5px;
    box-shadow: -1px 1px 1px 1px hsla(0, 0%, 0%, 0.1);
    &:hover {
      background-color: lighten($background, 2%);
    }
    &:active {
      background-color: lighten($background, 4%);
    }
  }
`

const NewGame = rx('button')`
  @include button;
  font-family: "League Spartan";
  color: $color-light;
  display: block;
  font-size: 30px;
  margin: 20px 0;
  text-shadow: -2px 2px 1px rgba(0, 0, 0, .4);
  transition-properties: color, text-shadow, font-size, left, top;
  transition-duration: 0.15s;
  position: relative;
  top: 0;
  left: 0;
  &:hover, &:focus {
    text-shadow: -2px 2px 2px rgba(0, 0, 0, .4);
    color: $link-hover;
    font-size: 32px;
    top: -1px;
    left: -1px;
  }
`


class Games extends React.Component {
  static propTypes = {
    path: arrayOf(string).isRequired,
    here: arrayOf(string).isRequired,

    list: arrayOf(string),
    gamesBySlug: object,
    playersById: object,

    error: bool.isRequired,
    lastLoaded: instanceOf(Date),
    loading: bool.isRequired,
    failed: bool.isRequired,
    sizes: arrayOf(string).isRequired,
    
    getGame: func.isRequired,
    getGames: func.isReuqired,
    goTo: func.isRequired,
    openGame: func.isRequired,
    openNewGame: func.isRequired,
    joinGame: func.isRequired,
    startJoinGame: func.isRequired,
    cancelJoinGame: func.isRequired,
    setInput: func.isRequired,
    join: func.isRequired
  }

  route = () => {
    const currentGame = this.currentGame();
    
    if (currentGame !== null) {
      if (currentGame !== 'new') { // TODO need to disallow "new" as slug
        const { gamesBySlug, getGame } = this.props;
        if (gamesBySlug === null || gamesBySlug[currentGame] === undefined) {
          getGame({slug: currentGame});
        }
      }
    }
    else
    {
      const { list, error, lastLoaded, getGames } = this.props;
      if ((list === null && !error) || expired(lastLoaded, 10)) {
        getGames();
      }
    }
  }
  componentDidMount = this.route;
  componentDidUpdate(prevProps) {
    if (!exactMatch(this.props.path, prevProps.path)) {
      this.route();
    }
  }
  return = () => {
    const { goTo, here } = this.props;
    goTo(here);
  }
  currentGame = () => this.props.path.length > 0 ? this.props.path[0] : null;

  startGame = () => {
    const { goTo, gamesBySlug } = this.props;
    const slug = this.currentGame();
    const game = gamesBySlug[slug];
    if (game.me !== undefined) {
      goTo(["play", this.currentGame()]);
    }
  }

  joinGame = (player) => {
    const { joinGame } = this.props;
    const slug = this.currentGame();
    return joinGame({slug, player});
  }

  render() {
    const { list, gamesBySlug, loading, failed, sizes } = this.props;
    let content;
    let returnButton;
    const currentGame = this.currentGame();
    if (
      currentGame !== 'new' && 
      (
        loading ||
        gamesBySlug === null || 
        (
          currentGame === null && 
          list === null
        ) || 
        (
          currentGame !== null && 
          gamesBySlug[currentGame] === undefined
        )
      )
    ) {
      content = <Spinner/>
    }
    else if (failed) {
      content = "Failed!"
    }
    else if (currentGame === null) {
      const { openGame, openNewGame } = this.props;

      const gameComponents = list.map(slug => {
        const { kind, name } = gamesBySlug[slug];
        return <GameListItem key={slug} {...{kind, slug, name, openGame, sizes}}/>
      });

      content = (
        <GamesList>
          {gameComponents}
          <NewGame onClick={openNewGame}>New Game</NewGame>
        </GamesList>
      )
    }
    else {
      returnButton = <ReturnButton onClick={this.return} rx={sizes}>{"<"}</ReturnButton>
      
      if (currentGame === 'new') {
        content = <NewGameForm/>
      }
      else {
        const { playersById, startJoinGame, cancelJoinGame, setInput, join } = this.props;

        const game = gamesBySlug[currentGame];

        const props = {
          ...game, ...join, sizes,
          playersById, startJoinGame, cancelJoinGame, setInput, 
          joinGame: this.joinGame,
          startGame: this.startGame
        }
        if (game !== undefined) {
          content = <GameInfo {...props}/>
        }
  
      }
    }

    return (
      <Container>
        <Body rx={sizes}>
          <Title rx={sizes}>
            {returnButton}
            TableTalk
          </Title>
          {content}
        </Body>
      </Container>
    )
  }
}

export default Games;
