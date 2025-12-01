import { Routes, Route, Navigate } from 'react-router-dom';
import TeacherView from './components/TeacherView';
import StudentView from './components/StudentView';
import Layout from './components/Layout';
import Home from './components/Home';
import { useEffect } from 'react';
import socket from './socket';
import { useDispatch } from 'react-redux';
import { setPoll, updateResults, endPoll, setStudents } from './store/pollSlice';

function App() {
    const dispatch = useDispatch();

    useEffect(() => {
        socket.on('poll_created', (poll) => {
            dispatch(setPoll(poll));
        });

        socket.on('poll_update', (poll) => {
            dispatch(setPoll(poll));
        });

        socket.on('poll_update_stats', (results) => {
            dispatch(updateResults(results));
        });

        socket.on('poll_ended', (results) => {
            dispatch(endPoll());
            dispatch(updateResults(results));
        });

        socket.on('poll_results', (results) => {
            dispatch(updateResults(results));
        });

        socket.on('students_update', (students) => {
            dispatch(setStudents(students));
        });

        socket.on('kicked', () => {
            alert('You have been removed from the session by the teacher.');
            window.location.href = '/';
        });

        return () => {
            socket.off('poll_created');
            socket.off('poll_update');
            socket.off('poll_update_stats');
            socket.off('poll_ended');
            socket.off('poll_results');
            socket.off('students_update');
            socket.off('kicked');
        };
    }, [dispatch]);

    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route element={<Layout />}>
                <Route path="teacher" element={<TeacherView />} />
                <Route path="student" element={<StudentView />} />
            </Route>
        </Routes>
    );
}

export default App;
