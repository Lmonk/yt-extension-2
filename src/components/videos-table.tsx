import { useSelector } from 'react-redux';
import LikeStatusIcon from './like-status-icon';
import { tabsSelector } from '@/redux/tabsSlice';

const formatDate = (timestamp: number) => {
  const date = new Date(timestamp);

  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

const formatTime = (timestamp: number) => {
  const date = new Date(timestamp);

  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');

  return `${hours}:${minutes}:${seconds}`;
}

const TabsTable = () => {
  const tabs = useSelector(tabsSelector);

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border border-gray-300">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-base font-medium text-gray-500 uppercase tracking-wider border border-gray-300">Date</th>
            <th className="px-6 py-3 text-left text-base font-medium text-gray-500 uppercase tracking-wider border border-gray-300">Time</th>
            <th className="px-6 py-3 text-left text-base font-medium text-gray-500 uppercase tracking-wider border border-gray-300">Name</th>
            <th className="px-6 py-3 text-center text-base font-medium text-gray-500 uppercase tracking-wider border border-gray-300">Liked</th>
          </tr>
        </thead>
        <tbody className="bg-white">
          {Object.keys(tabs).map(Number).map((key) => (
            <tr>
              <th className="px-6 py-3 text-left text-base font-medium text-gray-500 border border-gray-300">{formatDate(tabs[key].date)}</th>
              <th className="px-6 py-3 text-left text-base font-medium text-gray-500 border border-gray-300">{formatTime(tabs[key].date)}</th>
              <th className="px-6 py-3 text-left text-base font-medium text-gray-500 border border-gray-300">
                <a href={tabs[key].url} target="_blank">{tabs[key].title}</a>
              </th>
              <th className="px-6 py-3 text-center text-base font-medium justify-items-center text-gray-500 border border-gray-300">
                <LikeStatusIcon video={tabs[key].video} />
              </th>
            </tr>
          ))}
        </tbody>        
      </table>
    </div>
  );
};

export default TabsTable;