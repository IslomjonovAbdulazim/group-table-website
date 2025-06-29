import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { ChartData } from '../types';
import { getStudentChart } from '../services/groupService';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface StudentChartProps {
  groupCode: string;
  studentId: number;
  studentName: string;
}

const StudentChart: React.FC<StudentChartProps> = ({ groupCode, studentId, studentName }) => {
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadChartData();
  }, [groupCode, studentId]);

  const loadChartData = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getStudentChart(groupCode, studentId);
      setChartData(data);
    } catch (error) {
      setError('Grafik ma\'lumotlari yuklanmadi');
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="student-chart-loading">
        <div className="loading-spinner"></div>
        <p>Grafik yuklanmoqda...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="student-chart-error">
        <p>{error}</p>
        <button className="btn btn-primary" onClick={loadChartData}>
          Qayta urinish
        </button>
      </div>
    );
  }

  if (!chartData || chartData.positions.length === 0) {
    return (
      <div className="student-chart-empty">
        <p>Hali grafik ma'lumotlari mavjud emas</p>
      </div>
    );
  }

  // Prepare chart data
  const labels = chartData.positions.map(pos => pos.lesson);
  const positions = chartData.positions.map(pos => pos.position);
  
  // Invert positions for better visualization (lower position = higher on chart)
  const maxPosition = Math.max(...positions);
  const invertedPositions = positions.map(pos => maxPosition - pos + 1);

  const data = {
    labels,
    datasets: [
      {
        label: 'Reyting pozitsiyasi',
        data: invertedPositions,
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderWidth: 3,
        pointBackgroundColor: 'rgb(75, 192, 192)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 6,
        tension: 0.3,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: `${studentName} - Reyting o'zgarishi`,
        font: {
          size: 16,
          weight: 'bold' as const,
        },
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const actualPosition = maxPosition - context.parsed.y + 1;
            const changeData = chartData.positions[context.dataIndex];
            let changeText = '';
            if (changeData.change > 0) {
              changeText = ` (↑${changeData.change})`;
            } else if (changeData.change < 0) {
              changeText = ` (↓${Math.abs(changeData.change)})`;
            }
            return `Pozitsiya: #${actualPosition}${changeText}`;
          }
        }
      }
    },
    scales: {
      y: {
        reverse: false,
        beginAtZero: false,
        title: {
          display: true,
          text: 'Reyting pozitsiyasi',
        },
        ticks: {
          callback: function(value: any) {
            const actualPosition = maxPosition - value + 1;
            return `#${actualPosition}`;
          },
          stepSize: 1,
        },
      },
      x: {
        title: {
          display: true,
          text: 'Darslar',
        },
      },
    },
  };

  return (
    <div className="student-chart">
      <div className="chart-container">
        <Line data={data} options={options} />
      </div>
      
      <div className="position-summary">
        <h4>Pozitsiya o'zgarishlari:</h4>
        <div className="positions-list">
          {chartData.positions.map((pos, index) => (
            <div key={index} className="position-item">
              <span className="lesson-name">{pos.lesson}</span>
              <span className="position">#{pos.position}</span>
              {pos.change !== 0 && (
                <span className={`change ${pos.change > 0 ? 'positive' : 'negative'}`}>
                  {pos.change > 0 ? `↑${pos.change}` : `↓${Math.abs(pos.change)}`}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentChart;