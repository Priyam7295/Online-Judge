import React from 'react'
import image_one from './assets/girlcoder.png'
import Image from './assets/smartBoy.png'
import './specify.css'
import My_Web from './assets/myweb.jpg'
import Giphy from './assets/giphy.gif'
import {useNavigate} from 'react-router'
import swal from 'sweetalert';
function Specify() {
    const navigate = useNavigate();
    function go_to_prob_list(){
        swal({
            title: "Start Solving",
            // text: "",
            // icon: "warning",
            buttons: true,
            // dangerMode: true,
          })
            .then((value) => {
                if(value){

                    navigate("/problems");
                }
                else{
                    navigate("/");
                }
            });
    }

  return (
    <div className="specifyFeatures">
        
        <div className="coding_experience">
    <h1>Number 1 <span>Coding</span> Experience</h1>
    <p className="oneliner2">Enjoy a wonderful coding experience on our platform, where learning meets excitement. </p>
    <div className='specify_coding_area'>
        <div className='my_website_image'>
            <img src="https://cdn.loom.com/images/originals/6d02af0e2c2a42c49be015ffb403338e.jpg?Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9jZG4ubG9vbS5jb20vaW1hZ2VzL29yaWdpbmFscy82ZDAyYWYwZTJjMmE0MmM0OWJlMDE1ZmZiNDAzMzM4ZS5qcGciLCJDb25kaXRpb24iOnsiRGF0ZUxlc3NUaGFuIjp7IkFXUzpFcG9jaFRpbWUiOjE3MTk1MTkwNjN9fX1dfQ__&Key-Pair-Id=APKAJQIC5BGSW7XXK7FQ&Signature=ruR6eMBGjHFr42FLwJita2UGCVMx1N5e7Hr8U0K2vwUjwsrQnM%7EOgsu-CFe0TCJkVgBWcZzpBvXTrAA3k3HVZ9-tpSax1qAb%7EK6TWfrj7TCZhEwStx9YLnbLF8Rtb%7E99Ffj8dASUVk9k%7EQ1CxLuFYguwDl7iSRULvu2RwweYgqBfPmHr%7E67WK4gQTOCXuQrNpnzKXpFi3yD3vYiHIzfIQYmD8e0alAcAAbQfzCc3nPSPhHFvhdAqT59YbrIjVhSLbPiTRyMlIXbB39PYo4HlU3W5BhKrY2pWC377SM30KvOjCD2HO%7EtVtgj7ltID3O4PtMFowJ3O2ifOzD%7EdhyEwAw__&_gl=1*vq0fnu*_gcl_au*MTA1Mjc0NTgzMy4xNzE4NTUwMTAzLjExMzc2MzkzODMuMTcxODU1MDE3My4xNzE4NTUwMTcz" alt="" />
            <button onClick={go_to_prob_list} className="start_coding_button">Start Coding</button>
        </div>
    </div>
</div>


        <div className="specify1" >
            <div className="specify-item">
                <div className="specify-item-child" >
                    <img src={Image} alt="Image coding" />

                </div  >
                <div className="specify-item-child practice " >
                    <h1>Feeling bored with just learning <span>DSA</span>  concepts?</h1>
                    <p>Strengthen your grasp on DSA topics by diving into practical questions and challenges on our code practice website. Engage in hands-on problem-solving to master Data Structures and Algorithms effectively. We believe in Learning by doing</p>
                </div>
            </div>
        </div>
        <div className="specify1" >
            <div className="specify-item">
                <div className="specify-item-child" >
                    <img src={image_one} alt="Coding image" />

                </div  >
                <div className="specify-item-child practice " >
                    <h1>Problems categorized by <span>topic</span> and <span>difficulty </span> rating!</h1>
                    <p>Explore our comprehensive collection of Data Structures and Algorithms problems, categorized by topic and difficulty rating for easy sorting and solving, making learning and practicing DSA more efficient and enjoyable</p>
                </div>
            </div>
        </div>

        
    </div>
  )
}

export default Specify