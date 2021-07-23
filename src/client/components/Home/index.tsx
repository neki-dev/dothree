import React, {useState} from 'react';
import GitHubButton from 'react-github-btn';
import {Socket} from 'socket.io-client';
import useSocket from '~hook/useSocket';
import Editor from './Editor';
import Lobbies from './Lobbies';
import {Container, Logotype, ButtonCreate, Footer} from './styled';

export default function Home() {

    const socket: Socket = useSocket('/home');

    const [section, setSection] = useState<string>('lobbies');

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
                <Editor socket={socket} onClose={() => setSection('lobbies')} />
            ) : (
                <>
                    <ButtonCreate onClick={() => setSection('editor')}>Создать новую игру</ButtonCreate>
                    <Lobbies socket={socket} />
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
