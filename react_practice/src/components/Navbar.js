import React from 'react';

const Navbar = () => {
  return (
    <header>
      <nav className="navbar navbar-expand-md bg-light navbar-light">
        <a href="/" className="navbar-brand ms-lg-5">Самые богатые люди</a>

        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#menu"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse ms-lg-5" id="menu">
          <ul className="navbar-nav justify-content-center w-100">
            <li className="nav-item">
              <a href="/" className="nav-link">Главная</a>
            </li>
            <li className="nav-item">
              <a href="/billionaires" className="nav-link active">Список миллиардеров</a>
            </li>
            <li className="nav-item">
              <a href="#" className="nav-link">Menu_3</a>
            </li>
            <li className="nav-item">
              <a href="#" className="nav-link">Menu_4</a>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;