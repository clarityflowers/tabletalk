import React, { Component } from "react";
import { string, number, bool, func, shape, object, arrayOf } from "prop-types";
import rx from "resplendence";

rx`
@import '~Monsterhearts/styles';
@import '~Monsterhearts/fonts';
@import '~Monsterhearts/colors';
`;

const Container = rx("div")`
  color: $foreground;
  display: flex;
  flex-flow: row nowrap;
  font-family: $header;
  font-size: 20px;
`;
const Name = rx("div")`
  font-family: $header;
  margin-right: 15px;
`;
const Strings = rx("button")`
  @include button;
  font-size: 20px;
  font-family: "icomoon";
  color: $foreground;
  &:not(:disabled) {
    &:focus, &:hover {
      color: $foreground
    }
    &:focus :last-child {
      color: lighten($accent, 20%);
    }
    &:hover :last-child {
      color: $accent;
    }
    &:active :last-child {
      color: lighten($background, 10%);
    }
  }
`;
const Dot = rx("span")`
  margin-right: 6px;
  transition: 150ms color;
`;
const Plus = rx("button")`
  @include button-style;
  margin-right: 6px;
  position: relative;
  font-size: 16px;
  top: 3px;
  &:not(:disabled) {
    color: darken($foreground, 20%);
    &:focus {
      color: lighten($accent, 20%);
    }
    &:hover {
      color: $accent;
    }
    &:active {
      color: darken($accent, 30%);
    }
  }
  &:disabled {
    color: transparent;
  }
`;
const Count = rx("span")`
  color: $accent;
  font-family: $body;
  font-size: 27px;
  line-height: 1.3;
  margin-left: 20px;
  margin-right: 8px;
  min-width: 15px; 
`;

class String extends Component {
  static propTypes = {
    name: string.isRequired,
    myId: number.isRequired,
    theirId: number.isRequired,
    myStrings: number.isRequired,
    theirStrings: number.isRequired,
    readOnly: bool.isRequired,
    fromStringId: number,
    toStringId: number,
    slowActionsById: object.isRequired,
    createString: func.isRequired,
    addString: func.isRequired,
    spendString: func.isRequired
  };

  state = {
    takeActionId: null,
    giveActionId: null
  };

  takeString = () => {
    const { toStringId, addString } = this.props;
    if (toStringId) {
      addString({ id: toStringId });
    } else {
      const { myId, theirId, createString } = this.props;
      const actionId = createString({ from: myId, to: theirId });
      this.setState({ takeActionId: actionId });
    }
  };

  giveString = () => {
    const { fromStringId, addString } = this.props;
    if (fromStringId) {
      addString({ id: fromStringId });
    } else {
      const { myId, theirId, createString } = this.props;
      const actionId = createString({ from: theirId, to: myId });
      this.setState({ giveActionId: actionId });
    }
  };

  spendString = () => {
    const { toStringId, spendString } = this.props;
    spendString({ id: toStringId });
  };

  UNSAFE_componentWillUpdate(nextProps) {
    const { giveActionId, takeActionId } = this.state;
    const { slowActionsById } = this.props;
    if (giveActionId) {
      if (
        slowActionsById[giveActionId] &&
        !nextProps.slowActionsById[giveActionId]
      ) {
        this.setState({ giveActionId: null });
      }
    }
    if (takeActionId) {
      if (
        slowActionsById[takeActionId] &&
        !nextProps.slowActionsById[takeActionId]
      ) {
        this.setState({ takeActionId: null });
      }
    }
  }

  render() {
    const { name, myStrings, theirStrings, readOnly } = this.props;
    const { giveActionId, takeActionId } = this.state;
    let stringButton = null;
    if (myStrings) {
      const strings = [];
      for (let i = 0; i < myStrings + (takeActionId ? 1 : 0); i++) {
        strings.push(<Dot key={i}>@</Dot>);
      }
      stringButton = (
        <Strings onClick={this.spendString} disabled={readOnly}>
          {strings}
        </Strings>
      );
    }
    const theirTotalStrings = giveActionId ? theirStrings + 1 : theirStrings;
    const takeButton = readOnly ? null : (
      <Plus onClick={this.takeString} disabled={!!takeActionId}>
        take
      </Plus>
    );
    const giveButton = readOnly ? null : (
      <Plus onClick={this.giveString} disabled={!!giveActionId}>
        give
      </Plus>
    );
    return (
      <Container>
        <Name>{name}</Name>
        {stringButton}
        {takeButton}
        <Count>{theirTotalStrings ? theirTotalStrings : ""}</Count>
        {giveButton}
      </Container>
    );
  }
}

export default String;
