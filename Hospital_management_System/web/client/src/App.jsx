import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import Intake from './pages/Intake';
import Queue from './pages/Queue';
import Records from './pages/Records';
import Visit from './pages/Visit';
import Dashboard from './pages/Dashboard';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/intake" element={<Intake />} />
        <Route path="/queue" element={<Queue />} />
        <Route path="/records" element={<Records />} />
        <Route path="/visit" element={<Visit />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}
