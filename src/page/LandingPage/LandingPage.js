import React from "react";
import { Container } from "react-bootstrap";

const LandingPage = () => {
  return (
    <Container>
      <div className="landing-page-content">
        <div className="welcome-section">
          <h1 className="welcome-title">Welcome to core</h1>
          <p className="welcome-subtitle">
            Discover our latest collection of fashion essentials
          </p>
          <div className="welcome-description">
            <p>
              Explore our curated selection of clothing and accessories. From
              timeless classics to contemporary trends, find your perfect style.
            </p>
            <p>
              Browse our categories in the sidebar to discover products that
              match your taste.
            </p>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default LandingPage;
