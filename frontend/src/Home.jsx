import React from 'react'
import HeaderLogin from './HeaderLogin';

import Specify from './Specify';
import Intro_Website from './Intro_Website'


export default function Home() {
  return (
    <div>
        <div>
            <HeaderLogin/>
        </div>
        <div>
            <Intro_Website/>
        </div>
        <div>
            <Specify/>
        </div>
    </div>
  )
}
