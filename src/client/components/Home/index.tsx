import React, { useCallback, useState } from 'react';
import GitHubButton from 'react-github-btn';

import { Button } from './Button';
import { Editor } from './Editor';
import { Lobbies } from './Lobbies';

import { Container, Logotype, Footer } from './styled';

export function Home() {
  const [section, setSection] = useState<string>('lobbies');

  const setSectionLobbies = useCallback(() => setSection('lobbies'), []);
  const setSectionEditor = useCallback(() => setSection('editor'), []);

  return (
    <Container>
      <Logotype onClick={() => setSection('lobbies')}>
        <Logotype.Blocks>
          <Logotype.Block />
          <Logotype.Block />
          <Logotype.Block />
        </Logotype.Blocks>
        <Logotype.Label>dothree</Logotype.Label>
      </Logotype>
      {(section === 'editor') ? (
        <Editor onClose={setSectionLobbies} />
      ) : (
        <>
          <Button onClick={setSectionEditor} name="createLobby">Создать новую игру</Button>
          <Lobbies />
        </>
      )}
      <Footer>
        <GitHubButton
          href="https://github.com/neki-dev/dothree"
          data-color-scheme="no-preference: dark; light: dark; dark: dark;"
          data-size="large" data-show-count="true" aria-label="Star neki-dev/dothree on GitHub"
          data-icon="octicon-star"
        >
          Star
        </GitHubButton>
        <GitHubButton
          href="https://github.com/neki-dev"
          data-color-scheme="no-preference: dark; light: dark; dark: dark;"
          data-size="large" data-show-count="true"
          aria-label="Follow @neki-dev on GitHub"
        >
          Follow
        </GitHubButton>
      </Footer>
    </Container>
  );
}
