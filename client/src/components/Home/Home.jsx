import React, {useState, useCallback} from 'react';
import Lobbies from './Lobbies';
import GitHubButton from 'react-github-btn';
import useSocket from '../../hooks/useSocket';
import Editor from './Editor';

import './styles.scss';

export default () => {

    const socket = useSocket('/home');

    const [section, setSection] = useState('lobbies');

    const randomClass = useCallback(() => {
        return `player slot${Math.floor(1 + Math.random() * 5)}`;
    }, []);

    // ---

    return (
        <div className="container-home">
            <div className="logotype" onClick={() => setSection('lobbies')}>
                <div className="blocks">
                    <div className={randomClass()} />
                    <div className={randomClass()} />
                    <div className={randomClass()} />
                </div>
                <div className="text">
                    <span>three</span>do
                </div>
            </div>
            {(section === 'editor')
                ? <Editor socket={socket} onClose={() => setSection('lobbies')} />
                : (
                    <>
                        <div className="toggle-section" onClick={() => setSection('editor')}>Создать новую игру</div>
                        <Lobbies socket={socket} />
                    </>
                )
            }
            <div className="footer">
                <GitHubButton href="https://github.com/essle/dothree" data-color-scheme="no-preference: dark; light: dark; dark: dark;"
                    data-size="large" data-show-count="true" aria-label="Star essle/dothree on GitHub" data-icon="octicon-star" >Star</GitHubButton>
                <GitHubButton href="https://github.com/essle" data-color-scheme="no-preference: dark; light: dark; dark: dark;" 
                    data-size="large" data-show-count="true" aria-label="Follow @essle on GitHub">Follow</GitHubButton>
            </div>
        </div>
    );

};