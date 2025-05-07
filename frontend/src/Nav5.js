

import React, { useState } from 'react';
import { Link } from 'react-router-dom';



function Nav() { 
   
    return (
        <div className="navcontainer">
            <nav className="nav">
                <div className="nav-upper-options">
                    <div className="nav-option option1">
                        <img
                            src="https://media.geeksforgeeks.org/wp-content/uploads/20221210182148/Untitled-design-(29).png"
                            className="nav-img"
                            alt="dashboard"
                        />
                        <h3>
                        <Link to="/ConsultConsumer" style={{ textDecoration: 'none', color: 'inherit' }}>Dashboard</Link>
                        </h3>
                    </div>

                   
                    <div className="nav-option option2">
                        <img
                            src="https://media.geeksforgeeks.org/wp-content/uploads/20221210183323/10.png"
                            className="nav-img"
                            alt="blog"
                        />
                        <h3><Link to="/ProfileVet" style={{ textDecoration: 'none', color: 'inherit' }}> Profile </Link></h3>
                    </div>
                    

                    <div className="nav-option logout">
                        <img
                            src="https://media.geeksforgeeks.org/wp-content/uploads/20221210183321/7.png"
                            className="nav-img"
                            alt="logout"
                        />
                       <h3><Link to="/SignIn" style={{ textDecoration: 'none', color: 'inherit' }}> Log Out </Link></h3>
                    </div>
                </div>
            </nav>
        </div>
    );
};


export default Nav;
