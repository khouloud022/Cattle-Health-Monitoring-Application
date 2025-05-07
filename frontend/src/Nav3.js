

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
                        <Link to="/Consult" style={{ textDecoration: 'none', color: 'inherit' }}>Dashboard</Link>
                        </h3>
                    </div>
                        <div className="option2 nav-option" >
                        <img
                            src="https://media.geeksforgeeks.org/wp-content/uploads/20221210183320/5.png "
                            className="nav-img"
                            alt="tenders"
                        />
                        <h3 >
                        
                          <Link to="/CowList" style={{ textDecoration: 'none', color: 'inherit' }}>Add Cattle</Link>
                         </h3>

                        </div>

                    <div className="nav-option option5">
                        <img
                            src="https://media.geeksforgeeks.org/wp-content/uploads/20221210183323/10.png"
                            className="nav-img"
                            alt="blog"
                        />
                        <h3><Link to="/ProfileFar" style={{ textDecoration: 'none', color: 'inherit' }}> Profile </Link></h3>
                    </div>

                    <div className="nav-option logout">
                        <img
                            src="https://media.geeksforgeeks.org/wp-content/uploads/20221210183321/7.png"
                            className="nav-img"
                            alt="logout"
                        />
                        <h3>
                        <Link to="/SignIn" style={{ textDecoration: 'none', color: 'inherit' }}>Logout</Link></h3>
                    </div>
                </div>
            </nav>
        </div>
    );
};


export default Nav;
