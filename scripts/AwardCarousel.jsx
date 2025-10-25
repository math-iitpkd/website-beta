import React, { useState } from 'react';
import './AwardsCarousel.css';

const awards = [
  {
    title: 'Best Researcher Award',
    recipient: 'Dr. A. Kumar',
    year: '2023',
    body: 'Indian Science Congress',
    image: 'award1.jpg'
  },
  {
    title: 'Young Scientist Award',
    recipient: 'Dr. B. Sharma',
    year: '2022',
    body: 'INSA',
    image: 'award2.jpg'
  },
  {
    title: 'Lifetime Achievement',
    recipient: 'Prof. C. Rao',
    year: '2021',
    body: 'IIT Council',
    image: 'award3.jpg'
  },
  {
    title: 'Innovation Award',
    recipient: 'Dr. D. Mehta',
    year: '2024',
    body: 'DST',
    image: 'award4.jpg'
  }
];

export default function AwardsCarousel() {
  const [current, setCurrent] = useState(0);

  const prev = () => setCurrent((current - 1 + awards.length) % awards.length);
  const next = () => setCurrent((current + 1) % awards.length);

  return (
    <div className="carousel-container">
      <button className="nav left" onClick={prev}>‹</button>
      <div className="carousel">
        {awards.map((award, index) => {
          const position =
            index === current ? 'center' :
            index === (current - 1 + awards.length) % awards.length ? 'left' :
            index === (current + 1) % awards.length ? 'right' : 'hidden';

          return (
            <div key={index} className={`card ${position}`}>
              <img src={award.image} alt={award.title} />
              <div className="info">
                <h3>{award.title}</h3>
                <p><strong>{award.recipient}</strong></p>
                <p>{award.body} ({award.year})</p>
              </div>
            </div>
          );
        })}
      </div>
      <button className="nav right" onClick={next}>›</button>
    </div>
  );
}