import React, {useState, useCallback} from 'react';
import GitHubButton from 'react-github-btn';
import {Socket} from 'socket.io-client';
import useSocket from '~hook/useSocket';
import Editor from './Editor';
import Lobbies from './Lobbies';

import './styles.scss';

export default function Home() {

    const socket: Socket = useSocket('/home');

    const [section, setSection] = useState<string>('lobbies');

    const randomClass = useCallback(() => {
        return `player slot${Math.floor(1 + Math.random() * 5)}`;
    }, []);

    // ---

    return (
        <div className="container container-home">
            <div className="logotype" onClick={() => setSection('lobbies')}>
                <div className="blocks">
                    <div className={randomClass()} />
                    <div className={randomClass()} />
                    <div className={randomClass()} />
                </div>
                <div className="text">dothree</div>
            </div>
            {(section === 'editor') ? (
                <Editor socket={socket} onClose={() => setSection('lobbies')} />
            ) : (
                <>
                    <div className="toggle-section" onClick={() => setSection('editor')}>Создать новую игру</div>
                    <Lobbies socket={socket} />
                </>
            )}
            <div className="footer">
                <GitHubButton href="https://github.com/essle/dothree" data-color-scheme="no-preference: dark; light: dark; dark: dark;"
                    data-size="large" data-show-count="true" aria-label="Star essle/dothree on GitHub" data-icon="octicon-star" >Star</GitHubButton>
                <GitHubButton href="https://github.com/essle" data-color-scheme="no-preference: dark; light: dark; dark: dark;" 
                    data-size="large" data-show-count="true" aria-label="Follow @essle on GitHub">Follow</GitHubButton>
            </div>
        </div>
    );

}