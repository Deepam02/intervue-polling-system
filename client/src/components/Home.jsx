import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Home.css';

const Home = () => {
    const navigate = useNavigate();
    const [selectedRole, setSelectedRole] = useState(null); // 'student' | 'teacher'

    const handleContinue = () => {
        if (selectedRole) {
            navigate(`/${selectedRole}`);
        }
    };

    return (
        <div className="home-container">
            <div className="badge-container">
                <span className="intervue-badge">✨ Intervue Poll</span>
            </div>

            <h1 className="home-title">Welcome to the <strong>Live Polling System</strong></h1>
            <p className="home-subtitle">
                Please select the role that best describes you to begin using the live polling system
            </p>

            <div className="role-selection">
                <div
                    className={`role-card ${selectedRole === 'student' ? 'selected' : ''}`}
                    onClick={() => setSelectedRole('student')}
                >
                    <h3>I’m a Student</h3>
                    <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry</p>
                </div>

                <div
                    className={`role-card ${selectedRole === 'teacher' ? 'selected' : ''}`}
                    onClick={() => setSelectedRole('teacher')}
                >
                    <h3>I’m a Teacher</h3>
                    <p>Submit answers and view live poll results in real-time.</p>
                </div>
            </div>

            <button
                className="btn-continue"
                disabled={!selectedRole}
                onClick={handleContinue}
            >
                Continue
            </button>
        </div>
    );
};

export default Home;
