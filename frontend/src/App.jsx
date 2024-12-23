import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Events from './pages/Events';
import Attendees from './pages/Attendees';
import Tasks from './pages/Tasks';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Events />} />
                <Route path="/attendees" element={<Attendees />} />
                <Route path="/tasks" element={<Tasks />} />
            </Routes>
        </Router>
    );
};

export default App;
