import * as $ from 'jquery'; // импортироват все в доллар
import Post from "@models/Post";
import json from './assets/json.json';
import './styles/styles.css';
import './styles/scss.scss';
import WebpackLogo from '@/assets/webpack-logo';
import xml from './assets/data.xml';
import csv from './assets/data.csv';
import './babel-test';
import React from 'react';
import {render} from 'react-dom';

const post = new Post('webpack title', WebpackLogo);

const App = () => (
    <div className="container">
        <h1 className="title">my pack</h1>

        <div className="card">
            <h2>SCSS</h2>
        </div>
    </div>
);

render(<App/>, document.getElementById('app'));

document.querySelector('.title').classList.add('test');
console.log(post.toString());

console.log('json ', json);
console.log('xml ', xml);
console.log('csv ', csv);