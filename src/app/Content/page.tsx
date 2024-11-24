'use client';

import { useState, useEffect } from 'react';
import { Card, Spin, Tabs } from 'antd';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const { TabPane } = Tabs;

interface ChartData {
  timestamp: string;
  count: number;
}

interface ContentMetrics {
  totalPosts?: number;
  totalCategory?: number;
  totalViews?: number;
  totalPostShares?: number;
  totalComments?: number;
  totalPostExitCount?: number;
  totalPostBlocked?: number;
  totalPostDeleted?: number;
  chartData?: ChartData[];
}

interface DashboardData {
  allTime: ContentMetrics;
  daily: ContentMetrics;
  monthly: ContentMetrics;
}

const ContentModeration = () => {
  const [contentMetrics, setContentMetrics] = useState<DashboardData | null>(null);
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
        setContentMetrics(data.dashboard.contentMetrics);
      } catch (err: any) {
        console.error('Error fetching content data:', err.message);
        setError('Failed to fetch content data. Please try again later.');
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
    const chartData = contentMetrics?.[period as keyof DashboardData]?.chartData || [];

    const formattedData = chartData.map((item: ChartData) => ({
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
    const metrics = contentMetrics?.[period as keyof DashboardData]
    || {};
    return (
      <div className="grid grid-cols-2 gap-4 text-left mb-10">
        <Card>
          <p className="font-bold">Total Posts</p>
          <p>{metrics.totalPosts || 0}</p>
        </Card>
        <Card>
          <p className="font-bold">Total Categories</p>
          <p>{metrics.totalCategory || 0}</p>
        </Card>
        <Card>
          <p className="font-bold">Total Views</p>
          <p>{metrics.totalViews || 0}</p>
        </Card>
        <Card>
          <p className="font-bold">Total Shares</p>
          <p>{metrics.totalPostShares || 0}</p>
        </Card>
        <Card>
          <p className="font-bold">Total Comments</p>
          <p>{metrics.totalComments || 0}</p>
        </Card>
        <Card>
          <p className="font-bold">Total Post Exits</p>
          <p>{metrics.totalPostExitCount || 0}</p>
        </Card>
        <Card>
          <p className="font-bold">Total Posts Blocked</p>
          <p>{metrics.totalPostBlocked || 0}</p>
        </Card>
        <Card>
          <p className="font-bold">Total Posts Deleted</p>
          <p>{metrics.totalPostDeleted || 0}</p>
        </Card>
      </div>
    );
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4 text-black">Content Moderation</h1>
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <Spin tip="Loading content data..." />
        </div>
      ) : error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : (
        contentMetrics && (
          <Tabs defaultActiveKey="daily" centered>
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
        )
      )}
    </div>
  );
};

export default ContentModeration;
