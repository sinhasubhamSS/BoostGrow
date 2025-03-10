import React from 'react'
import { useNavigate } from 'react-router-dom'
import "./Csscomponents/herosection.css"

function HeroSection()
 {
  const navigate=useNavigate();
  const handleclick=(e)=>{
    navigate("/Todopage")

  }
  return (
    <>
      <div className="hero__section">
        <div className="container__one">
          <p className='hero__txt'>Hey Record Your Daily Task
            <button className='hero__btn'onClick={handleclick}>Get Started
            <span>🚀</span></button>
          </p>

        </div>
        <div className="container__two">
          <img src="" alt="" />
        </div>
      </div>
    </>
  )
}

export default HeroSection