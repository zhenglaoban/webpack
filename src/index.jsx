// import './index.css'
// import './index.less'
// import './index.scss'
// import image from './images/1.png';
// import '../font/iconfont.css'

import React from 'react';
import ReactDOM from 'react-dom';
import App from 'pages/index'

if (module.hot) {
    module.hot.accept();
}

// var func = str => {
//     document.getElementById('app').innerHTML = str;
// };
// func(' es6 新语法-箭222323头3333数!');

// document.getElementById('postcss').innerHTML = "<h1>我自动添231加了1111浏览器22前缀33333333333333</h1><img src='"+ image +"'/><span class='icon iconfont icon-daohang'></span>";
// class App extends React.Component {



ReactDOM.render(<App />
, document.getElementById('app'));