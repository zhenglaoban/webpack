

import React from 'react';
import Apply from './apply';
import ReactDOM from 'react-dom';
import './index.less'
export default class App  extends React.Component {

    constructor(porps) {
        super(porps);
        this.str ='2222'
        // Apply.apply(this)
      }
    
      test(){
        console.log(this.str)
      }

    
    render(){

        return <div className="box">
                <Apply />
            <div className="child">222</div>
        </div>
    }
}