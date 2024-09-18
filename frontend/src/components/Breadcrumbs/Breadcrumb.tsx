import { Link } from 'react-router-dom';
import { FaCalendarAlt } from 'react-icons/fa';
import { useState, useEffect } from 'react';

interface BreadcrumbProps {
  pageName: string;
}

const Breadcrumb = ({ pageName }: BreadcrumbProps) => {
  const [todayDate, setTodayDate] = useState<string>('');

  useEffect(() => {
    fetchTodayDate();
  }, []);

  const fetchTodayDate = () => {
    const today = new Date();
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'short', // Can be 'narrow', 'short', 'long'
      year: 'numeric',
      month: 'short', // Can be 'numeric', '2-digit', 'narrow', 'short', 'long'
      day: 'numeric'
    };
    const formattedDate = today.toLocaleDateString('en-US', options);
    setTodayDate(formattedDate);
  };
  
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <h2 className="text-title-md2 font-semibold text-black dark:text-white">
        <div className="flex items-center gap-2">
          <FaCalendarAlt className="calendar-icon" />
          <span className="text-sm text-gray-500">{todayDate}</span>
        </div>
      </h2>

      <nav>
        <ol className="flex items-center gap-2">
          <li>
            <Link className="font-medium" to="/">
              Dashboard /
            </Link>
          </li>
          <li className="font-medium text-orange-500">{pageName}</li>
        </ol>
      </nav>
    </div>
  );
};

export default Breadcrumb;
