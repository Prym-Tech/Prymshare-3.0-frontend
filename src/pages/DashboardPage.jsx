import { useAuth } from "../hooks/useAuth";

const DashboardPage = () => {
    const { user } = useAuth();
    return (
        <div className="text-center p-20">
            <h1 className="text-5xl font-bold text-prym-dark-green">Dashboard</h1>
            <p className="text-prym-dark mt-4">Welcome, {user?.email}!</p>
            <p>This is a protected page. Your page builder will be here.</p>
        </div>
    );
};
export default DashboardPage;   