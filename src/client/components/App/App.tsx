import React from 'react';

import './normalize.scss';
import './styles.scss';

interface ComponentProps {
    children: JSX.Element;
}

export default function App({children}: ComponentProps) {
    return children;
}