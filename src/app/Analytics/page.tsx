'use client';

import { useState, useEffect } from 'react';
import { Card, Spin, Tabs, Tag } from 'antd';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const { TabPane } = Tabs;

interface MetricData {
  timestamp: string;
  count: number;
}

interface Metrics {
  totalLikes: number;
  totalViews: number;
  totalNotifications: number;
  totalMessage: number;
  privateChats: number;
  chartData: MetricData[];
}

interface MetricsResponse {
  daily: Metrics;
  monthly: Metrics;
  allTime: Metrics;
}

const MetricsPage = () => {
  const [data, setData] = useState<MetricsResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/data');
        if (!res.ok) throw new Error('Failed to fetch data');
        const json = await res.json();
        setData(json.dashboard.engagementMetrics);
      } catch (err: any) {
        setError('Failed to fetch data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const formatNumber = (num: number) => {
    return num.toLocaleString();
  };

  const renderMetrics = (metrics: Metrics) => (
    <div className="grid grid-cols-2 gap-4 text-left">
      <Card>
        <p className="font-bold">Total Views</p>
        <p>{formatNumber(metrics.totalViews)}</p>
      </Card>
      <Card>
        <p className="font-bold">Total Likes</p>
        <p>{formatNumber(metrics.totalLikes)}</p>
      </Card>
      <Card>
        <p className="font-bold">Total Notifications</p>
        <p>{formatNumber(metrics.totalNotifications)}</p>
      </Card>
      <Card>
        <p className="font-bold">Total Messages</p>
        <p>{formatNumber(metrics.totalMessage)}</p>
      </Card>
      <Card>
        <p className="font-bold">Private Chats</p>
        <p>{formatNumber(metrics.privateChats)}</p>
      </Card>
    </div>
  );

  if (loading) return <div className="flex justify-center items-center h-screen"><Spin tip="Loading metrics..." /></div>;
  if (error) return <p className="text-red-500 text-center">{error}</p>;
  if (!data) return <p className="text-gray-500 text-center">No data available</p>;

  const renderChart = (chartData: MetricData[]) => {
    if (!chartData || chartData.length === 0) {
      return <p></p>;
    }

    const processedData = chartData
      .map((item) => ({
        date: new Date(item.timestamp).toLocaleDateString('en-US', {
          month: 'short', 
          day: 'numeric', 
        }),
        value: item.count,
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return (
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={processedData}>
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
          <Legend />
          <Line type="monotone" dataKey="value" stroke="orange" />
        </LineChart>
      </ResponsiveContainer>
    );
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4 text-black text-center">Metric Analytics</h1>
      <Tabs defaultActiveKey="daily" centered>
        {['daily', 'monthly', 'allTime'].map(key => (
          <TabPane tab={`${key.charAt(0).toUpperCase() + key.slice(1)} Metrics`} key={key}>
            {renderMetrics(data[key as keyof MetricsResponse])}
            <div className="mt-6">{renderChart(data[key as keyof MetricsResponse].chartData)}</div>
          </TabPane>
        ))}
      </Tabs>
      <Card title="Insights & Alerts" className="mt-6">
        {data.daily.totalViews > 1000 ? (
          <Tag color="green">High Daily Engagement</Tag>
        ) : (
          <Tag color="yellow">Moderate Daily Engagement</Tag>
        )}
        <p className="mt-2">
          Keep monitoring trends to improve underperforming metrics and highlight categories with consistent growth.
        </p>
      </Card>
    </div>
  );
};

export default MetricsPage;
