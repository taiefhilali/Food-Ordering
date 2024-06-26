import React from 'react';

interface Stat {
  label: string;
  value: string;
  className?: string;
}

const Statistics: React.FC = () => {
  const stats: Stat[] = [
    { label: 'Sales', value: '$23,000' },
    { label: 'Products', value: '?', id: 'product-count' }, // Added ID for potential data fetching
    { label: 'Total Visitors', value: '--', id: 'total-visitors' }, // Added ID for potential data fetching
    { label: 'Total Sales', value: '+24%', className: 'positive' },
    { label: 'Total Expenses', value: '-28%', className: 'negative' },
    { label: 'Conversion Rate', value: '+45%', className: 'positive' },
  ];

  return (
    <div className="statistics-container">
      <h1>Statistics</h1>
      {stats.map((stat) => (
        <div key={stat.label} className="stat-row">
          <div className="stat-label">{stat.label}</div>
          <div className={`stat-value ${stat.className || ''}`}>{stat.value}</div>
        </div>
      ))}
    </div>
  );
};

export default Statistics;
