'use client';

import useDataFetch from '@/hooks/dataFetch';
import {
  ArcElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip
} from 'chart.js';
import { Pie } from 'react-chartjs-2';
import Loader from '../Loader';

ChartJS.register(
  CategoryScale,
  LinearScale,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function ItemCountChart() {
  const { data, isLoading, error } = useDataFetch<any[]>('/reports/item-counts')
  const itemCountData = data || [
    { category: 'All', count: 0 },
    { category: 'Tools', count: 0 },
    { category: 'Consumables', count: 0 },
  ]

  const labels: string[] = [];
  const counts: number[] = [];
  const backgroundColors = ['#FF0000', '#3CB371', '#87CEEB'];


  itemCountData.forEach(countData => {
    labels.push(countData.category)
    counts.push(countData.count)
  })

  const chartData = {
    labels,
    datasets: [
      {
        label: "Item Count",
        data: counts,
        backgroundColor: backgroundColors
      }
    ]
  };

  return (
    <Loader loading={isLoading} error={error}>
      <div className='w-[350px] max-h-[350px] border border-gray-300 p-4'>
        <Pie data={chartData} />
      </div>
    </Loader>
  );
}