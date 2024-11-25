'use client';

import { useState, useEffect } from 'react';
import { Card, Spin, Tabs, Tag } from 'antd';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const { TabPane } = Tabs;

interface ChartData {
  timestamp: string;
  count: number;
}

interface BlockchainMetrics {
  totalChains: string[];
  totalTokens: number;
  totalWalletOnEthereum: number;
  totalWalletOnPolygon: number;
  totalWalletOnSolana: number;
  chartData?: ChartData[];
}

interface DashboardData {
  allTime: BlockchainMetrics;
  daily: BlockchainMetrics;
  monthly: BlockchainMetrics;
}

const BlockchainDashboard = () => {
  const [blockchainMetrics, setBlockchainMetrics] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/data'); 
        if (!res.ok) {
          throw new Error('Failed to fetch blockchain data');
        }
        const data = await res.json();
        setBlockchainMetrics(data.dashboard.blockchainMetrics);
      } catch (err: any) {
        console.error('Error fetching blockchain data:', err.message);
        setError('Failed to fetch blockchain data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const renderMetrics = (metrics: BlockchainMetrics) => (
    <div className="grid grid-cols-2 gap-4 text-left">
      <Card>
        <p className="font-bold">Total Chains</p>
        <p>{metrics.totalChains?.join(', ') || 'N/A'}</p>
      </Card>
      <Card>
        <p className="font-bold">Total Tokens</p>
        <p>{metrics.totalTokens || 0}</p>
      </Card>
      <Card>
        <p className="font-bold">Wallets on Ethereum</p>
        <p>{metrics.totalWalletOnEthereum || 0}</p>
      </Card>
      <Card>
        <p className="font-bold">Wallets on Polygon</p>
        <p>{metrics.totalWalletOnPolygon || 0}</p>
      </Card>
      <Card>
        <p className="font-bold">Wallets on Solana</p>
        <p>{metrics.totalWalletOnSolana || 0}</p>
      </Card>
    </div>
  );

  const renderLineChart = (chartData: ChartData[] | undefined) => {
    if (!chartData || chartData.length === 0) {
      return <p className="text-gray-500 text-center">No chart data available</p>;
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
      <h1 className="text-2xl font-bold mb-4 text-black text-center">Blockchain Dashboard</h1>
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <Spin tip="Loading blockchain data..." />
        </div>
      ) : error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : blockchainMetrics ? (
        <Tabs defaultActiveKey="daily" centered>
          <TabPane tab="Daily Metrics" key="daily">
            {renderMetrics(blockchainMetrics.daily)}
            {renderLineChart(blockchainMetrics.daily.chartData)}
          </TabPane>
          <TabPane tab="Monthly Metrics" key="monthly">
            {renderMetrics(blockchainMetrics.monthly)}
            {renderLineChart(blockchainMetrics.monthly.chartData)}
          </TabPane>
          <TabPane tab="All-Time Metrics" key="allTime">
            {renderMetrics(blockchainMetrics.allTime)}
          </TabPane>
        </Tabs>
      ) : (
        <p className="text-gray-500 text-center">No blockchain data available</p>
      )}
    </div>
  );
};

export default BlockchainDashboard;
