import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import socket from '../socket';
import { setUser, setHasAnswered, setAnsweredOptionId } from '../store/userSlice';
import '../styles/StudentView.css';

const StudentView = () => {
    const dispatch = useDispatch();
    const { poll, results } = useSelector((state) => state.poll);
    const { name, id, hasAnswered, answeredOptionId } = useSelector((state) => state.user);

    const [inputName, setInputName] = useState('');
    const [selectedOption, setSelectedOption] = useState(null);
    const [error, setError] = useState('');

    // Track current question to detect changes
    const lastQuestionIndexRef = useRef(-1);

    useEffect(() => {
        if (poll) {
            // If question index changed, reset state
            if (poll.currentQuestionIndex !== lastQuestionIndexRef.current) {
                lastQuestionIndexRef.current = poll.currentQuestionIndex;
                setSelectedOption(null);
                dispatch(setHasAnswered(false));
                dispatch(setAnsweredOptionId(null));
            }
        }
    }, [poll, dispatch]);

    const handleJoin = () => {
        if (!inputName.trim()) return;

        socket.emit('join_session', { name: inputName }, (response) => {
            if (response.error) {
                setError(response.error);
            } else {
                dispatch(setUser({ name: inputName, id: response.student.id, role: 'student' }));
                setError('');
            }
        });
    };

    const handleSubmit = () => {
        if (selectedOption === null) return;

        socket.emit('submit_answer', { optionId: selectedOption }, (response) => {
            if (response.success) {
                dispatch(setHasAnswered(true));
                dispatch(setAnsweredOptionId(selectedOption));
            } else {
                alert(response.error);
            }
        });
    };

    if (!name) {
        return (
            <div className="student-view card centered">
                <h2>Welcome!</h2>
                <p>Please enter your name to join the session.</p>
                <div className="input-group">
                    <input
                        className="input-field"
                        type="text"
                        value={inputName}
                        onChange={(e) => setInputName(e.target.value)}
                        placeholder="Your Name"
                    />
                    {error && <div className="error-msg">{error}</div>}
                </div>
                <button className="btn btn-primary full-width" onClick={handleJoin}>Join</button>
            </div>
        );
    }

    // If poll is active and user hasn't answered
    if (poll && poll.status === 'active' && !hasAnswered) {
        return (
            <div className="student-view card">
                <div className="poll-header">
                    <span className="badge">Live Poll</span>
                    <span className="question-number">Q{poll.currentQuestionIndex + 1}/{poll.totalQuestions}</span>
                </div>
                <h2 className="question-text">{poll.question}</h2>
                <div className="options-list">
                    {poll.options.map(opt => (
                        <label key={opt.id} className={`option-item ${selectedOption === opt.id ? 'selected' : ''}`}>
                            <input
                                type="radio"
                                name="poll-option"
                                value={opt.id}
                                checked={selectedOption === opt.id}
                                onChange={() => setSelectedOption(opt.id)}
                            />
                            <span className="option-text">{opt.text}</span>
                        </label>
                    ))}
                </div>
                <button
                    className="btn btn-primary full-width"
                    onClick={handleSubmit}
                    disabled={selectedOption === null}
                >
                    Submit Answer
                </button>
            </div>
        );
    }

    // If poll ended or user answered, show results
    if ((poll && (poll.status === 'ended' || poll.status === 'waiting')) || (poll && hasAnswered)) {
        const isEndedOrWaiting = poll.status === 'ended' || poll.status === 'waiting';

        return (
            <div className="student-view card">
                <div className="poll-header">
                    <span className="badge">{isEndedOrWaiting ? 'Results' : 'Submitted'}</span>
                    <span className="question-number">Q{poll.currentQuestionIndex + 1}/{poll.totalQuestions}</span>
                </div>

                <h2>{poll.status === 'active' ? 'Thanks for voting!' : 'Poll Results'}</h2>
                <div className="poll-question">
                    <h3>{poll.question}</h3>
                </div>

                <div className="live-results">
                    {poll.options.map(opt => {
                        const resultOpt = results?.options.find(r => r.id === opt.id);
                        const votes = resultOpt ? resultOpt.votes : 0;
                        const total = results?.totalVotes || 0;
                        const percentage = total > 0 ? Math.round((votes / total) * 100) : 0;

                        const isCorrect = isEndedOrWaiting && poll.correctOptionId === opt.id;
                        const isSelected = answeredOptionId === opt.id;

                        return (
                            <div key={opt.id} className={`result-bar-container ${isCorrect ? 'correct-answer' : ''} ${isSelected ? 'selected-answer' : ''}`}>
                                <div className="result-label">
                                    <span>
                                        {opt.text}
                                        {isCorrect && ' ✅'}
                                        {isSelected && ' (You)'}
                                    </span>
                                    <span>{percentage}%</span>
                                </div>
                                <div className="result-bar-bg">
                                    <div
                                        className="result-bar-fill"
                                        style={{
                                            width: `${percentage}%`,
                                            backgroundColor: isCorrect ? '#10B981' : (isSelected ? '#3B82F6' : undefined)
                                        }}
                                    ></div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {isEndedOrWaiting && answeredOptionId !== null && (
                    <div className={`feedback-msg ${poll.correctOptionId === answeredOptionId ? 'success' : 'error'}`}>
                        {poll.correctOptionId === answeredOptionId ? 'Correct! 🎉' : 'Incorrect 😔'}
                    </div>
                )}

                {poll.status === 'active' && <p className="wait-msg">Waiting for others to finish...</p>}
                {poll.status === 'waiting' && <p className="wait-msg">Waiting for next question...</p>}
                {poll.status === 'ended' && <p className="wait-msg">Quiz Completed!</p>}
            </div>
        );
    }

    return (
        <div className="student-view card centered">
            <span className="intervue-badge">✨ Intervue Poll</span>
            <div className="loader"></div>
            <h2>Wait for the teacher to ask questions..</h2>
        </div>
    );
};

export default StudentView;
