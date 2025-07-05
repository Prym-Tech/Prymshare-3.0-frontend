import { useState, useEffect } from 'react';
import { useAtomValue } from 'jotai';
import { activePageAtom } from '../state/pageAtoms';
import { getAnalyticsData } from '../services/analyticsService';
import Spinner from '../components/ui/Spinner';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { HiOutlineEye, HiOutlineCursorClick, HiOutlineUserGroup } from 'react-icons/hi';

const StatCard = ({ title, value, icon }) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
        <div className="flex items-center gap-4">
            <div className="bg-prym-green/10 p-3 rounded-lg">
                {icon}
            </div>
            <div>
                <p className="text-sm text-gray-500">{title}</p>
                <p className="text-3xl font-bold text-prym-dark-green">{value}</p>
            </div>
        </div>
    </div>
);

const AnalyticsPage = () => {
    const activePage = useAtomValue(activePageAtom);
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (activePage) {
            const fetchData = async () => {
                try {
                    setLoading(true);
                    const analyticsData = await getAnalyticsData(activePage.id);
                    setData(analyticsData);
                } catch (error) {
                    console.error("Failed to fetch analytics", error);
                } finally {
                    setLoading(false);
                }
            };
            fetchData();
        }
    }, [activePage]);

    if (loading) {
        return <div className="flex justify-center items-center h-full"><Spinner /></div>;
    }

    if (!data) {
        return <div className="text-center text-gray-500">No analytics data available for this page yet.</div>;
    }

    return (
        <div className="animate-faderrout space-y-8">
            <h1 className="text-3xl font-bold text-prym-dark-green">Analytics</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard title="Total Views" value={data.total_views} icon={<HiOutlineEye className="h-6 w-6 text-prym-green" />} />
                <StatCard title="Unique Visitors" value={data.unique_views} icon={<HiOutlineUserGroup className="h-6 w-6 text-prym-green" />} />
                <StatCard title="Total Clicks" value={data.total_link_clicks} icon={<HiOutlineCursorClick className="h-6 w-6 text-prym-green" />} />
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                <h3 className="font-semibold text-prym-dark-green mb-4">Views (Last 30 Days)</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={data.views_per_day} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="views" stroke="#00D37F" strokeWidth={2} />
                    </LineChart>
                </ResponsiveContainer>
            </div>

             <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                <h3 className="font-semibold text-prym-dark-green mb-4">Top Links</h3>
                <ul className="space-y-2">
                    {data.top_links.map((link, index) => (
                        <li key={index} className="flex justify-between items-center text-sm">
                            <a href={link.details__url} target="_blank" rel="noopener noreferrer" className="text-prym-pink hover:underline truncate">
                                {link.details__url}
                            </a>
                            <span className="font-bold text-prym-dark-green">{link.clicks} clicks</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default AnalyticsPage;