'use client';

import { useState, useEffect } from 'react';
import { Card, Table, Tag, Spin, Tabs } from 'antd';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const { TabPane } = Tabs;

const Users = () => {
  const [userMetrics, setUserMetrics] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/data');

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || res.statusText);
        }

        const data = await res.json();
        console.log(data);
        
        setUserMetrics(data.dashboard.userMetrics);
      } catch (err: any) {
        console.error('Error fetching data:', err.message);
        setError('Failed to fetch data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const renderGraph = (period: string) => {
    const chartData = userMetrics?.[period]?.chartData || [];

    // Format data for the graph
    const formattedData = chartData.map((item: any) => ({
      date: formatDate(item.timestamp),
      count: item.count,
    }));

    return (
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={formattedData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            angle={-45}
            textAnchor="end"
            height={60}
            tick={{ fontSize: 10 }}
          />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="count" stroke="#FFA500" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    );
  };

  const renderMetrics = (period: string) => {
    const metrics = userMetrics?.[period] || {};
    return (
      <div className="grid grid-cols-3 gap-4 text-center mb-10">
        <Card>
          <p className="font-bold">Active Users</p>
          <p>{metrics.activeUser || 0}</p>
        </Card>
        <Card>
          <p className="font-bold">Total Users</p>
          <p>{metrics.totalUser || 0}</p>
        </Card>
        <Card>
          <p className="font-bold">Referrals</p>
          <p>{metrics.totalReferral || 0}</p>
        </Card>
        <Card>
          <p className="font-bold">Creators</p>
          <p>{metrics.creator || 0}</p>
        </Card>
      </div>
    );
  };

  return (
    <div>
      <h1 className="text-2xl text-center font-bold mb-6 text-black">User Management Dashboard</h1>
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <Spin tip="Loading data..." />
        </div>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div>
          <Tabs defaultActiveKey="daily">
            <TabPane tab="Daily Metrics" key="daily">
              {renderMetrics('daily')}
              {renderGraph('daily')}
            </TabPane>
            <TabPane tab="Monthly Metrics" key="monthly">
              {renderMetrics('monthly')}
              {renderGraph('monthly')}
            </TabPane>
            <TabPane tab="All-Time Metrics" key="allTime">
              {renderMetrics('allTime')}
            </TabPane>
          </Tabs>
        </div>
      )}
    </div>
  );
};

export default Users;
