import { Outlet } from 'react-router-dom';
import Navbar from '../ui/Navbar';

const MainLayout = () => {
  return (
    <div className="bg-prym-light min-h-screen">
      <Navbar />
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;