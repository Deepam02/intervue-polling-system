import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import socket from '../socket';
import { setLoading, setError, resetError } from '../store/pollSlice';
import '../styles/TeacherView.css';

const TeacherView = () => {
    const dispatch = useDispatch();
    const { poll, results, students, isLoading, error } = useSelector((state) => state.poll);

    // State for creating poll
    const [questions, setQuestions] = useState([{
        id: Date.now(),
        question: '',
        options: [{ text: '', isCorrect: false }, { text: '', isCorrect: false }],
        duration: 60
    }]);

    const [timeLeft, setTimeLeft] = useState(0);
    const [isCreating, setIsCreating] = useState(false);

    useEffect(() => {
        if (poll && poll.status === 'active') {
            // poll.createdAt is the start time of the CURRENT question
            const endTime = poll.createdAt + poll.duration * 1000;
            const interval = setInterval(() => {
                const left = Math.max(0, Math.ceil((endTime - Date.now()) / 1000));
                setTimeLeft(left);
                if (left <= 0) clearInterval(interval);
            }, 1000);
            return () => clearInterval(interval);
        } else {
            setTimeLeft(0);
        }
    }, [poll]);

    // Clear error after 5 seconds
    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => {
                dispatch(resetError());
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [error, dispatch]);

    // --- Form Handlers ---

    const addQuestion = () => {
        setQuestions([...questions, {
            id: Date.now(),
            question: '',
            options: [{ text: '', isCorrect: false }, { text: '', isCorrect: false }],
            duration: 60
        }]);
    };

    const removeQuestion = (index) => {
        if (questions.length > 1) {
            setQuestions(questions.filter((_, i) => i !== index));
        }
    };

    const updateQuestion = (index, field, value) => {
        const newQuestions = [...questions];
        newQuestions[index][field] = value;
        setQuestions(newQuestions);
    };

    const handleOptionChange = (qIndex, optIndex, value) => {
        const newQuestions = [...questions];
        newQuestions[qIndex].options[optIndex].text = value;
        setQuestions(newQuestions);
    };

    const handleCorrectChange = (qIndex, optIndex, isCorrect) => {
        const newQuestions = [...questions];
        const options = newQuestions[qIndex].options.map((opt, i) => ({
            ...opt,
            isCorrect: i === optIndex ? isCorrect : (isCorrect ? false : opt.isCorrect)
        }));

        if (isCorrect) {
            options.forEach((opt, i) => {
                if (i !== optIndex) opt.isCorrect = false;
            });
        }
        newQuestions[qIndex].options = options;
        setQuestions(newQuestions);
    };

    const addOption = (qIndex) => {
        const newQuestions = [...questions];
        newQuestions[qIndex].options.push({ text: '', isCorrect: false });
        setQuestions(newQuestions);
    };

    const removeOption = (qIndex, optIndex) => {
        const newQuestions = [...questions];
        if (newQuestions[qIndex].options.length > 2) {
            newQuestions[qIndex].options = newQuestions[qIndex].options.filter((_, i) => i !== optIndex);
            setQuestions(newQuestions);
        }
    };

    const createPoll = () => {
        // Validation
        for (let i = 0; i < questions.length; i++) {
            const q = questions[i];
            const validOptions = q.options.filter(o => o.text.trim() !== '');
            if (!q.question.trim() || validOptions.length < 2) {
                dispatch(setError(`Please complete Question ${i + 1} (text and at least 2 options).`));
                return;
            }
            const correctIndex = validOptions.findIndex(o => o.isCorrect);
            if (correctIndex === -1) {
                dispatch(setError(`Please mark the correct answer for Question ${i + 1}.`));
                return;
            }
        }

        setIsCreating(true);
        dispatch(setLoading(true));

        const payload = questions.map(q => {
            const validOptions = q.options.filter(o => o.text.trim() !== '');
            const correctIndex = validOptions.findIndex(o => o.isCorrect);
            return {
                question: q.question,
                options: validOptions.map(o => o.text),
                duration: q.duration,
                correctOptionId: correctIndex !== -1 ? correctIndex : null
            };
        });

        socket.emit('create_poll', { questions: payload }, (response) => {
            setIsCreating(false);
            dispatch(setLoading(false));
            
            if (response.error) {
                dispatch(setError(response.error));
                return;
            }
            if (response.success) {
                // Reset form
                setQuestions([{
                    id: Date.now(),
                    question: '',
                    options: [{ text: '', isCorrect: false }, { text: '', isCorrect: false }],
                    duration: 60
                }]);
            }
        });
    };

    const handleNextQuestion = () => {
        dispatch(setLoading(true));
        socket.emit('next_question', {}, (res) => {
            dispatch(setLoading(false));
            if (res.error) {
                dispatch(setError(res.error));
            }
        });
    };

    const handleRemoveStudent = (studentId) => {
        if (window.confirm('Are you sure you want to remove this student?')) {
            socket.emit('remove_student', { studentId }, (res) => {
                if (res.success) {
                    console.log('Student removed successfully');
                } else if (res.error) {
                    dispatch(setError(res.error));
                }
            });
        }
    };

    // --- Render ---

    if (poll) {
        // Active or Ended or Waiting
        const isWaiting = poll.status === 'waiting';
        const isEnded = poll.status === 'ended';
        const isActive = poll.status === 'active';

        return (
            <div className="teacher-view card">
                {error && (
                    <div className="error-notification">
                        <span>⚠️ {error}</span>
                        <button onClick={() => dispatch(resetError())} className="close-btn">×</button>
                    </div>
                )}
                
                <div className="poll-header-active">
                    <span className="intervue-badge">✨ Intervue Poll</span>
                    {isActive && <div className="timer-badge">{timeLeft}s</div>}
                    {isWaiting && <div className="timer-badge status-waiting">Waiting...</div>}
                    {isEnded && <div className="timer-badge status-ended">Ended</div>}
                </div>

                <h2>
                    {isEnded ? 'Quiz Completed' : `Question ${poll.currentQuestionIndex + 1} of ${poll.totalQuestions}`}
                </h2>

                <div className="poll-question-active">
                    <h3>{poll.question}</h3>
                </div>

                <div className="live-results">
                    {poll.options.map(opt => {
                        const resultOpt = results?.options.find(r => r.id === opt.id);
                        const votes = resultOpt ? resultOpt.votes : 0;
                        const total = results?.totalVotes || 0;
                        const percentage = total > 0 ? Math.round((votes / total) * 100) : 0;

                        // Show correct answer if not active (waiting or ended)
                        const isCorrect = !isActive && poll.correctOptionId === opt.id;

                        return (
                            <div key={opt.id} className={`result-bar-container ${isCorrect ? 'correct-answer' : ''}`}>
                                <div className="result-label">
                                    <span>{opt.text} {isCorrect && '✅'}</span>
                                    <span>{votes} votes ({percentage}%)</span>
                                </div>
                                <div className="result-bar-bg">
                                    <div
                                        className="result-bar-fill"
                                        style={{
                                            width: `${percentage}%`,
                                            backgroundColor: isCorrect ? '#10B981' : undefined
                                        }}
                                    ></div>
                                </div>
                            </div>
                        );
                    })}
                </div>
                <div className="total-votes">Total Votes: {results?.totalVotes || 0}</div>

                {/* Students List */}
                {students && students.length > 0 && (
                    <div className="students-panel">
                        <h3>Connected Students ({students.length})</h3>
                        <div className="students-list">
                            {students.map(student => (
                                <div key={student.id} className="student-item">
                                    <div className="student-info">
                                        <span className="student-name">{student.name}</span>
                                        <span className={`student-status ${student.hasAnswered ? 'answered' : 'waiting'}`}>
                                            {student.hasAnswered ? '✓ Answered' : '⏳ Waiting'}
                                        </span>
                                    </div>
                                    <button 
                                        className="btn-remove-student"
                                        onClick={() => handleRemoveStudent(student.id)}
                                        title="Remove student"
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="poll-controls">
                    {isActive && (
                        <button className="btn btn-secondary" onClick={() => window.location.reload()}>End Question Early</button>
                    )}
                    {isWaiting && (
                        <>
                            {students && students.length > 0 && !students.every(s => s.hasAnswered) && (
                                <p className="wait-msg">⏳ Waiting for all students to answer...</p>
                            )}
                            <button 
                                className="btn btn-primary" 
                                onClick={handleNextQuestion}
                                disabled={students && students.length > 0 && !students.every(s => s.hasAnswered)}
                            >
                                Next Question →
                            </button>
                        </>
                    )}
                    {isEnded && (
                        <button className="btn btn-secondary" onClick={() => window.location.reload()}>Start New Poll</button>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="teacher-view">
            {error && (
                <div className="error-notification">
                    <span>⚠️ {error}</span>
                    <button onClick={() => dispatch(resetError())} className="close-btn">×</button>
                </div>
            )}
            
            <div className="header-section">
                <span className="intervue-badge">✨ Intervue Poll</span>
                <h1>Let's <strong>Get Started</strong></h1>
                <p className="subtitle">you'll have the ability to create and manage polls, ask questions, and monitor your students' responses in real-time.</p>
            </div>

            <div className="create-poll-form">
                {questions.map((q, qIndex) => (
                    <div key={q.id} className="question-block">
                        <div className="form-header">
                            <label className="input-label">Enter your question</label>
                            <div className="header-controls">
                                <select
                                    className="timer-select"
                                    value={q.duration}
                                    onChange={(e) => updateQuestion(qIndex, 'duration', parseInt(e.target.value))}
                                >
                                    <option value="30">30 seconds</option>
                                    <option value="60">60 seconds</option>
                                    <option value="90">90 seconds</option>
                                    <option value="120">120 seconds</option>
                                </select>
                            </div>
                        </div>

                        <div className="question-input-container">
                            <textarea
                                className="question-input"
                                value={q.question}
                                onChange={(e) => updateQuestion(qIndex, 'question', e.target.value)}
                                placeholder="Type your question here..."
                                maxLength={100}
                            />
                            <div className="char-count">{q.question.length}/100</div>
                        </div>

                        <div className="options-section">
                            <div className="options-header">
                                <span>Options</span>
                                <span>Correct?</span>
                            </div>

                            {q.options.map((opt, optIndex) => (
                                <div key={optIndex} className="option-row">
                                    <div className="option-number">{optIndex + 1}</div>
                                    <input
                                        className="option-input-field"
                                        type="text"
                                        value={opt.text}
                                        onChange={(e) => handleOptionChange(qIndex, optIndex, e.target.value)}
                                        placeholder={`Option ${optIndex + 1}`}
                                    />

                                    <div className="correct-toggle">
                                        <label className={`radio-label ${opt.isCorrect ? 'active' : ''}`}>
                                            <input
                                                type="radio"
                                                name={`correct-${qIndex}-${optIndex}`}
                                                checked={opt.isCorrect}
                                                onChange={() => handleCorrectChange(qIndex, optIndex, true)}
                                            />
                                            Yes
                                        </label>
                                        <label className={`radio-label ${!opt.isCorrect ? 'active' : ''}`}>
                                            <input
                                                type="radio"
                                                name={`correct-${qIndex}-${optIndex}`}
                                                checked={!opt.isCorrect}
                                                onChange={() => handleCorrectChange(qIndex, optIndex, false)}
                                            />
                                            No
                                        </label>
                                    </div>

                                    {q.options.length > 2 && (
                                        <button className="btn-remove-opt" onClick={() => removeOption(qIndex, optIndex)}>×</button>
                                    )}
                                </div>
                            ))}

                            <button className="btn-add-option" onClick={() => addOption(qIndex)}>+ Add Option</button>
                        </div>
                    </div>
                ))}

                <div className="form-footer">
                    <button 
                        className="btn-ask" 
                        onClick={createPoll}
                        disabled={isCreating || isLoading}
                    >
                        {isCreating ? 'Creating Poll...' : 'Ask Question'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TeacherView;
