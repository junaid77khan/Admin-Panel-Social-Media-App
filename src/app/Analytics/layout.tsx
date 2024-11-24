import Sidebar from '../../components/Sidebar';
import 'antd/dist/reset.css';

export default function AnalyticsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 lg:ml-64 p-6 bg-gray-100 overflow-auto">{children}</main>
    </div>
  );
}
