// src/pages/About.jsx
import React from 'react';
import './pagescss/about.css';

function About() {
    return (
        <section className="about-section">
            <div className="about-content">
                <div className="about-text">
                    <h1>TaskSync</h1>
                    <h2>Empowering Daily Routines</h2>
                    <p>
                        At TaskSync, our mission is to help you build and share your daily habits.
                        Started in 2025 by <strong>Shubham Sinha</strong>, we believed in the power of routine,
                        and the magic happens when you pair to‑do tasks with storytelling.
                    </p>
                    <p>
                        Whether you're setting tasks for the day or sharing your progress, TaskSync
                        lets you stay productive while inspiring others.
                    </p>
                    <ul>
                        <li>📌 Track your daily to‑dos</li>
                        <li>📤 Share completed tasks with your community</li>
                        <li>🎯 Build consistent habits and inspire peers</li>
                    </ul>
                </div>
                <div className="about-image">
                    <div className="about-image">
                        <img
                            src="https://cdn-icons-png.flaticon.com/512/10481/10481728.png"
                            alt="To-Do list"
                            width="300"
                        />
                    </div>

                </div>


            </div>
        </section>
    );
}

export default About;
