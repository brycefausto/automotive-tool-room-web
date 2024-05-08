'use client';

import React from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import useDataFetch from '@/hooks/dataFetch';
import Loader from '../Loader';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: true,
      text: 'Subject Borrow Count Chart',
    },
  },
};

const labels = ['Subject Borrow Count'];

export default function SubjectBorrowCountChart() {
  const { data, isLoading, error } = useDataFetch<any[]>('/reports/subjects')
  const itemCountData = data || []

  const backgroundColors = ['#FF0000', '#3CB371', '#87CEEB', '#FFFF00', '#FF4500', '#00FFFF', '#4169E1', '	#9370DB', '	#FF00FF', '#FFA500'];

  const datasets = itemCountData.map((countData, i) => {
    let backgroundColor = '#5F6A6A'
    if (i < backgroundColors.length) {
      backgroundColor = backgroundColors[i]
    }

    return {
      label: countData.subjectName,
      data: [countData.quantity],
      backgroundColor
    }
  })

  const chartData = {
    labels,
    datasets
  };

  return (
    <Loader loading={isLoading} error={error}>
      <div className='w-[500px] h-[600px]'>
        <Bar options={options} data={chartData} />
      </div>
    </Loader>
  );
}