import React, { useState } from "react";
import GitHubButton from "react-github-btn";

import { Editor } from "./editor";
import { Lobbies } from "./lobbies";
import { HomeSection } from "./types";
import { Button } from "~/client/components/button";

import { Container, Logotype, Description, Footer } from "./styled";

export const HomePage: React.FC = () => {
  const [section, setSection] = useState(HomeSection.Lobbies);

  const openLobbies = () => setSection(HomeSection.Lobbies);

  const openEditor = () => setSection(HomeSection.Editor);

  return (
    <Container>
      <Logotype onClick={() => setSection(HomeSection.Lobbies)}>
        <Logotype.Blocks>
          <Logotype.Block />
          <Logotype.Block />
          <Logotype.Block />
        </Logotype.Blocks>
        <Logotype.Label>DOTHREE</Logotype.Label>
      </Logotype>
      <Description>
        Online logic game, which like a mix of tetris and tic-tac-toe
      </Description>

      {section === HomeSection.Editor ? (
        <Editor onClose={openLobbies} />
      ) : (
        <>
          <Button onClick={openEditor}>Create lobby</Button>
          <Lobbies />
        </>
      )}

      <Footer>
        <GitHubButton
          href="https://github.com/neki-dev/dothree"
          data-color-scheme="no-preference: dark; light: dark; dark: dark;"
          data-size="large"
          data-show-count="true"
          aria-label="Star neki-dev/dothree on GitHub"
          data-icon="octicon-star"
        >
          Star
        </GitHubButton>
        <GitHubButton
          href="https://github.com/neki-dev"
          data-color-scheme="no-preference: dark; light: dark; dark: dark;"
          data-size="large"
          data-show-count="true"
          aria-label="Follow @neki-dev on GitHub"
        >
          Follow
        </GitHubButton>
      </Footer>
    </Container>
  );
};
