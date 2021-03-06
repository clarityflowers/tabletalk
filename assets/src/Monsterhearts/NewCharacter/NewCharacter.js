import React, { Component } from "react";
import { string, number, bool, func, shape, object, arrayOf } from "prop-types";
import rx from "resplendence";

import { Link } from "Routing";
import Skin from "./Skin";

rx`
@import '~common/styles';
@import '~Monsterhearts/colors';
`;

const Container = rx("div")`
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  justify-content: flex-start;
  height: 100%;
  width: 100%;
`;

const Header = rx("div")`
  font-family: "Fontin";
  font-size: 20px;
  color: darken($foreground, 10%);
  margin: 0 0 20px 0;
  flex: 0 0 auto;
`;

const Buffer = rx("div")`
  flex: 1 0 0;
  height: 50%;
  width: 100%;
  max-height: 50%;
  transition: .3s max-height cubic-bezier(1, 0, 0, 1);
  &.collapsed {
    max-height: 0%;
  }
`;

const SkinList = rx("div")`
  display: flex;
  flex: 0 0 auto;
  flex-flow: row wrap;
  justify-content: center;
  width: 100%;
`;
const SkinLink = rx(Link)`
  @include link;
  font-family: "League Spartan";
  font-size: 18px;
  
  color: $foreground;
  display: block;
  transition-duration: .3s;
  transition-property: color;  
  height: 32px;
  &.active {
    color: lighten(saturate($accent, 10%), 5%);
  }
  &:not(.active).dull {
    color: darken($foreground, 20%);
  }
  margin: 0 10px;
`;

const Content = rx("div")`
  flex: 0 1 auto;
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  width: 100%;
  margin: 20px 0;
  height: 100%;
  &.under-laptop {
    overflow-y: scroll;
    height: auto;
  }
`;
const BigName = rx("span")`
  font-size: 1.2em;
`;

const Button = rx("button")`
  @include button;
  background: $accent;
  color: white;
  font-family: "Yataghan";
  font-size: 25px;
  padding: 0 10px 1px 10px;
  border-radius: 5px;
  box-shadow: -1px 1px 2px 1px rgba(0, 0, 0, .5);
  transition: 150ms background, 150ms color, 300ms width;
  margin-bottom: 10px;
  &:hover, &:focus {
    background: lighten($accent, 10%);
  }
  &:active {
    background: lighten($accent, 15%);
  }
  flex: 0 0 auto;
  height: 43px;
  min-width: 220px;
`;

class NewCharacter extends Component {
  static propTypes = {
    slug: string,
    depth: number.isRequired,
    playbooks: arrayOf(string).isRequired,
    sizes: arrayOf(string).isRequired,
    myCharacters: arrayOf(number).isRequired,
    playbook: string,
    createCharacter: func.isRequired,
    goTo: func.isRequired
  };

  state = {
    creating: false
  };

  handleClickCreate = () => {
    const { playbook, createCharacter } = this.props;
    if (playbook) {
      this.setState({ creating: true });
      createCharacter({ playbook });
    }
  };

  componentDidUpdate(prevProps) {
    const { depth, goTo, myCharacters } = this.props;
    if (myCharacters.length > prevProps.myCharacters.length) {
      myCharacters.forEach(id => {
        if (!prevProps.myCharacters.includes(id)) {
          goTo([id.toString(), "edit"], depth - 1);
          return;
        }
      });
    }
  }

  render() {
    const { depth, playbook, playbooks, sizes } = this.props;
    const { creating } = this.state;
    const skins = playbooks.map(name => {
      return (
        <SkinLink
          to={name.toLowerCase()}
          depth={depth}
          key={name}
          rx={{ dull: !!playbook }}
        >
          The <BigName>{name}</BigName>
        </SkinLink>
      );
    });

    let skin = null;
    let createButton = null;
    if (playbook) {
      skin = <Skin {...{ playbook, sizes }} />;
      createButton = (
        <Button onClick={this.handleClickCreate} disabled={creating}>
          Create the {playbook}
        </Button>
      );
    }
    return (
      <Container>
        <Buffer rx={{ collapsed: !!playbook }} />
        <Content rx={sizes}>
          <Header>Select a Skin</Header>
          <SkinList>{skins}</SkinList>
          {createButton}
          {skin}
        </Content>
        <Buffer rx={{ collapsed: !!playbook }} />
      </Container>
    );
  }
}

export default NewCharacter;
