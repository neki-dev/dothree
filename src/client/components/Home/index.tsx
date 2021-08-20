import React, {useCallback, useState} from 'react';
import GitHubButton from 'react-github-btn';
import Editor from './Editor';
import Lobbies from './Lobbies';
import Button from './Button';
import {Container, Logotype, Footer} from './styled';

export default function Home() {

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
                    <Button onClick={setSectionEditor}>Создать новую игру</Button>
                    <Lobbies />
                </>
            )}
            <Footer>
                <GitHubButton href="https://github.com/essle/dothree"
                    data-color-scheme="no-preference: dark; light: dark; dark: dark;"
                    data-size="large" data-show-count="true" aria-label="Star essle/dothree on GitHub"
                    data-icon="octicon-star">Star</GitHubButton>
                <GitHubButton href="https://github.com/essle"
                    data-color-scheme="no-preference: dark; light: dark; dark: dark;"
                    data-size="large" data-show-count="true"
                    aria-label="Follow @essle on GitHub">Follow</GitHubButton>
            </Footer>
        </Container>
    );

}