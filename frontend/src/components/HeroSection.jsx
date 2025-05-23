import React from 'react'
import { useNavigate } from 'react-router-dom'
import "./Csscomponents/herosection.css"

function HeroSection() {
  const navigate = useNavigate();

  const handleClick = (e) => {
    navigate("/Todopage")
  }
  return (
    <>
     
      <section className="hero__section">
        <div className="hero__content">
          <div className="hero__text">
            <h1 className="hero__title">Hey, Record Your Daily Tasks</h1>
            <p className="hero__subtitle">Stay organized and boost your productivity</p>
            <button className='hero__btn' onClick={handleClick}>
              Get Started
              <span className="btn-icon">🚀</span>
            </button>
          </div>
          <div className="hero__image">
            <img
              src="https://illustrations.popsy.co/amber/digital-nomad.svg"
              alt="Task management illustration"
              className="hero__img"
            />
          </div>
        </div>
      </section>
    </>
  )
}

export default HeroSection