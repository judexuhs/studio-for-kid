import React from 'react';
import {createRoot} from 'react-dom/client';
import App from './App';
import Landing from './Landing';
import PublicPages from './PublicPages';
import HeroOptions from './HeroOptions';
createRoot(document.getElementById('root')).render(location.pathname.replace(/\/$/,'') === '/hero-options' ? <HeroOptions/> : location.pathname.replace(/\/$/,'') === '/studio' ? <App/> : location.pathname === '/canvas-showcase' ? <App showcase/> : location.pathname==='/' ? <Landing/> : <PublicPages path={location.pathname.replace(/\/$/,'')}/>);
