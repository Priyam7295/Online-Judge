import React from 'react'
import image_one from './assets/girlcoder.png'
import Image from './assets/smartBoy.png'
import './specify.css'

function Specify() {
  return (
    <div class="specifyFeatures">
        <div className="specify1" >
            <div className="specify-item">
                <div className="specify-item-child" >
                    <img src={Image} alt="Image coding" />

                </div  >
                <div className="specify-item-child practice " >
                    <h1>Feeling bored with just learning DSA concepts?</h1>
                    <p>"Strengthen your grasp on DSA topics by diving into practical questions and challenges on our code practice website. Engage in hands-on problem-solving to master Data Structures and Algorithms effectively. We believe in Learning by doing."</p>
                </div>
            </div>
        </div>
        <div className="specify1" >
            <div className="specify-item">
                <div className="specify-item-child" >
                    <img src={image_one} alt="Coding image" />

                </div  >
                <div className="specify-item-child practice " >
                    <h1>Problems categorized by topic and difficulty rating!</h1>
                    <p>"Explore our comprehensive collection of Data Structures and Algorithms problems, categorized by topic and difficulty rating for easy sorting and solving, making learning and practicing DSA more efficient and enjoyable."</p>
                </div>
            </div>
        </div>

        
    </div>
  )
}

export default Specify