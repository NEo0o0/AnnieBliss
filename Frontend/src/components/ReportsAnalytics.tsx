import { useState, useMemo } from 'react';
import { TrendingUp, Users, Calendar as CalendarIcon } from 'lucide-react';
import { MonthYearPicker } from './MonthYearPicker';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from 'recharts';

interface Booking {
  id: string;
  date: string;
  timeSlot: string; // e.g., "09:00", "18:00"
  memberName: string;
  classType: string;
  nationality: string;
  attended: boolean;
}

// Mock booking data with various time slots, class types, and nationalities
const mockBookings: Booking[] = [
  // December 2024
  { id: '1', date: '2024-12-01', timeSlot: '06:00', memberName: 'Sarah Thompson', classType: 'Vinyasa Flow', nationality: 'American', attended: true },
  { id: '2', date: '2024-12-01', timeSlot: '18:00', memberName: 'Anna Petrova', classType: 'Hatha Yoga', nationality: 'Russian', attended: true },
  { id: '3', date: '2024-12-02', timeSlot: '09:00', memberName: 'Somchai Wang', classType: 'Vinyasa Flow', nationality: 'Thai', attended: true },
  { id: '4', date: '2024-12-02', timeSlot: '18:00', memberName: 'Elena Ivanov', classType: 'Yin Yoga', nationality: 'Russian', attended: true },
  { id: '5', date: '2024-12-03', timeSlot: '06:00', memberName: 'Michael Chen', classType: 'Power Yoga', nationality: 'Chinese', attended: true },
  { id: '6', date: '2024-12-03', timeSlot: '18:00', memberName: 'David Kim', classType: 'Vinyasa Flow', nationality: 'Korean', attended: true },
  { id: '7', date: '2024-12-04', timeSlot: '09:00', memberName: 'Lisa Anderson', classType: 'Hatha Yoga', nationality: 'American', attended: true },
  { id: '8', date: '2024-12-04', timeSlot: '18:00', memberName: 'Natasha Volkov', classType: 'Vinyasa Flow', nationality: 'Russian', attended: true },
  { id: '9', date: '2024-12-05', timeSlot: '06:00', memberName: 'Emma Rodriguez', classType: 'Power Yoga', nationality: 'Spanish', attended: true },
  { id: '10', date: '2024-12-05', timeSlot: '17:00', memberName: 'John Smith', classType: 'Yin Yoga', nationality: 'British', attended: true },
  { id: '11', date: '2024-12-06', timeSlot: '09:00', memberName: 'Pranee Thai', classType: 'Vinyasa Flow', nationality: 'Thai', attended: true },
  { id: '12', date: '2024-12-06', timeSlot: '18:00', memberName: 'Igor Petrov', classType: 'Hatha Yoga', nationality: 'Russian', attended: true },
  { id: '13', date: '2024-12-07', timeSlot: '06:00', memberName: 'Jessica Lee', classType: 'Power Yoga', nationality: 'American', attended: true },
  { id: '14', date: '2024-12-08', timeSlot: '09:00', memberName: 'Sophie Martin', classType: 'Vinyasa Flow', nationality: 'French', attended: true },
  { id: '15', date: '2024-12-08', timeSlot: '18:00', memberName: 'Niran Patel', classType: 'Yin Yoga', nationality: 'Thai', attended: true },
  { id: '16', date: '2024-12-09', timeSlot: '06:00', memberName: 'Maria Garcia', classType: 'Hatha Yoga', nationality: 'Spanish', attended: true },
  { id: '17', date: '2024-12-10', timeSlot: '17:00', memberName: 'Kevin Zhang', classType: 'Vinyasa Flow', nationality: 'Chinese', attended: true },
  { id: '18', date: '2024-12-10', timeSlot: '18:00', memberName: 'Olga Smirnova', classType: 'Power Yoga', nationality: 'Russian', attended: true },
  { id: '19', date: '2024-12-11', timeSlot: '09:00', memberName: 'James Taylor', classType: 'Vinyasa Flow', nationality: 'American', attended: true },
  { id: '20', date: '2024-12-12', timeSlot: '06:00', memberName: 'Anna Kowalski', classType: 'Hatha Yoga', nationality: 'Polish', attended: true },
  { id: '21', date: '2024-12-12', timeSlot: '18:00', memberName: 'Suda Chaiya', classType: 'Yin Yoga', nationality: 'Thai', attended: true },
  { id: '22', date: '2024-12-13', timeSlot: '09:00', memberName: 'Robert Martinez', classType: 'Vinyasa Flow', nationality: 'American', attended: true },
  { id: '23', date: '2024-12-14', timeSlot: '17:00', memberName: 'Dmitry Volkov', classType: 'Power Yoga', nationality: 'Russian', attended: true },
  { id: '24', date: '2024-12-15', timeSlot: '06:00', memberName: 'Amanda Wilson', classType: 'Vinyasa Flow', nationality: 'Australian', attended: true },
  { id: '25', date: '2024-12-15', timeSlot: '18:00', memberName: 'Liam O\'Brien', classType: 'Hatha Yoga', nationality: 'Irish', attended: true },
  
  // Additional bookings for other months in 2024
  { id: '26', date: '2024-11-15', timeSlot: '06:00', memberName: 'Sarah Thompson', classType: 'Vinyasa Flow', nationality: 'American', attended: true },
  { id: '27', date: '2024-11-16', timeSlot: '18:00', memberName: 'Anna Petrova', classType: 'Hatha Yoga', nationality: 'Russian', attended: true },
  { id: '28', date: '2024-11-17', timeSlot: '09:00', memberName: 'Somchai Wang', classType: 'Power Yoga', nationality: 'Thai', attended: true },
  { id: '29', date: '2024-10-20', timeSlot: '18:00', memberName: 'Elena Ivanov', classType: 'Vinyasa Flow', nationality: 'Russian', attended: true },
  { id: '30', date: '2024-10-21', timeSlot: '06:00', memberName: 'Michael Chen', classType: 'Yin Yoga', nationality: 'Chinese', attended: true },
  { id: '31', date: '2024-09-10', timeSlot: '09:00', memberName: 'David Kim', classType: 'Vinyasa Flow', nationality: 'Korean', attended: true },
  { id: '32', date: '2024-09-11', timeSlot: '18:00', memberName: 'Lisa Anderson', classType: 'Hatha Yoga', nationality: 'American', attended: true },
  { id: '33', date: '2024-08-05', timeSlot: '17:00', memberName: 'Natasha Volkov', classType: 'Power Yoga', nationality: 'Russian', attended: true },
  { id: '34', date: '2024-07-12', timeSlot: '06:00', memberName: 'Emma Rodriguez', classType: 'Vinyasa Flow', nationality: 'Spanish', attended: true },
  { id: '35', date: '2024-06-18', timeSlot: '18:00', memberName: 'John Smith', classType: 'Yin Yoga', nationality: 'British', attended: true },
  { id: '36', date: '2024-05-22', timeSlot: '09:00', memberName: 'Pranee Thai', classType: 'Vinyasa Flow', nationality: 'Thai', attended: true },
  { id: '37', date: '2024-04-14', timeSlot: '06:00', memberName: 'Igor Petrov', classType: 'Hatha Yoga', nationality: 'Russian', attended: true },
  { id: '38', date: '2024-03-08', timeSlot: '18:00', memberName: 'Jessica Lee', classType: 'Power Yoga', nationality: 'American', attended: true },
  { id: '39', date: '2024-02-25', timeSlot: '09:00', memberName: 'Sophie Martin', classType: 'Vinyasa Flow', nationality: 'French', attended: true },
  { id: '40', date: '2024-01-30', timeSlot: '17:00', memberName: 'Niran Patel', classType: 'Hatha Yoga', nationality: 'Thai', attended: true },
];

const COLORS = {
  'Vinyasa Flow': '#6B9080',
  'Hatha Yoga': '#A4B494',
  'Power Yoga': '#D4A574',
  'Yin Yoga': '#C89F9C',
  'Restorative': '#E8B4B8'
};

const NATIONALITY_COLORS = {
  'American': '#3B82F6',
  'Russian': '#EF4444',
  'Thai': '#10B981',
  'Chinese': '#F59E0B',
  'Korean': '#8B5CF6',
  'British': '#EC4899',
  'Spanish': '#F97316',
  'French': '#6366F1',
  'Other': '#9CA3AF'
};

export function ReportsAnalytics() {
  const [activeTab, setActiveTab] = useState<'monthly' | 'yearly'>('monthly');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [yearlyViewYear, setYearlyViewYear] = useState(new Date().getFullYear());

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const handlePreviousMonth = () => {
    if (selectedMonth === 0) {
      setSelectedMonth(11);
      setSelectedYear(selectedYear - 1);
    } else {
      setSelectedMonth(selectedMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (selectedMonth === 11) {
      setSelectedMonth(0);
      setSelectedYear(selectedYear + 1);
    } else {
      setSelectedMonth(selectedMonth + 1);
    }
  };

  // Filter bookings for selected month
  const monthlyBookings = useMemo(() => {
    return mockBookings.filter(booking => {
      const bookingDate = new Date(booking.date);
      return (
        bookingDate.getMonth() === selectedMonth &&
        bookingDate.getFullYear() === selectedYear &&
        booking.attended
      );
    });
  }, [selectedMonth, selectedYear]);

  // Filter bookings for selected year
  const yearlyBookings = useMemo(() => {
    return mockBookings.filter(booking => {
      const bookingDate = new Date(booking.date);
      return bookingDate.getFullYear() === yearlyViewYear && booking.attended;
    });
  }, [yearlyViewYear]);

  // Chart 1: Peak Hours (Monthly)
  const peakHoursData = useMemo(() => {
    const timeSlotCounts: { [key: string]: number } = {};
    
    monthlyBookings.forEach(booking => {
      timeSlotCounts[booking.timeSlot] = (timeSlotCounts[booking.timeSlot] || 0) + 1;
    });

    return Object.entries(timeSlotCounts)
      .map(([timeSlot, count]) => ({
        timeSlot,
        attendees: count
      }))
      .sort((a, b) => a.timeSlot.localeCompare(b.timeSlot));
  }, [monthlyBookings]);

  // Chart 2: Class Popularity (Monthly)
  const classPopularityData = useMemo(() => {
    const classTypeCounts: { [key: string]: number } = {};
    
    monthlyBookings.forEach(booking => {
      classTypeCounts[booking.classType] = (classTypeCounts[booking.classType] || 0) + 1;
    });

    const total = monthlyBookings.length;

    return Object.entries(classTypeCounts).map(([classType, count]) => ({
      name: classType,
      value: count,
      percentage: ((count / total) * 100).toFixed(1)
    }));
  }, [monthlyBookings]);

  // Chart 3: Nationality Trends (Yearly)
  const nationalityTrendsData = useMemo(() => {
    // Group by month and nationality
    const monthlyNationalities: { [key: number]: { [key: string]: number } } = {};

    yearlyBookings.forEach(booking => {
      const month = new Date(booking.date).getMonth();
      if (!monthlyNationalities[month]) {
        monthlyNationalities[month] = {};
      }
      monthlyNationalities[month][booking.nationality] = 
        (monthlyNationalities[month][booking.nationality] || 0) + 1;
    });

    // Get top 5 nationalities
    const nationalityCounts: { [key: string]: number } = {};
    yearlyBookings.forEach(booking => {
      nationalityCounts[booking.nationality] = (nationalityCounts[booking.nationality] || 0) + 1;
    });

    const topNationalities = Object.entries(nationalityCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([nationality]) => nationality);

    // Create data for each month
    return monthNames.map((month, index) => {
      const dataPoint: any = { month: month.slice(0, 3) }; // Short month name
      
      topNationalities.forEach(nationality => {
        dataPoint[nationality] = monthlyNationalities[index]?.[nationality] || 0;
      });

      return dataPoint;
    });
  }, [yearlyBookings]);

  // Get top nationalities for the line chart
  const topNationalities = useMemo(() => {
    const nationalityCounts: { [key: string]: number } = {};
    yearlyBookings.forEach(booking => {
      nationalityCounts[booking.nationality] = (nationalityCounts[booking.nationality] || 0) + 1;
    });

    return Object.entries(nationalityCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([nationality]) => nationality);
  }, [yearlyBookings]);

  // Chart 4: Most Popular Classes (Yearly)
  const popularClassesYearlyData = useMemo(() => {
    const classTypeCounts: { [key: string]: number } = {};
    
    yearlyBookings.forEach(booking => {
      classTypeCounts[booking.classType] = (classTypeCounts[booking.classType] || 0) + 1;
    });

    return Object.entries(classTypeCounts)
      .map(([classType, count]) => ({
        classType,
        bookings: count
      }))
      .sort((a, b) => b.bookings - a.bookings);
  }, [yearlyBookings]);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-lg shadow-xl border border-[var(--color-sand)]">
          <p className="text-sm text-[var(--color-earth-dark)]">{payload[0].name}</p>
          <p className="text-lg text-[var(--color-sage)]">
            {payload[0].value} attendees
          </p>
        </div>
      );
    }
    return null;
  };

  const PieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-lg shadow-xl border border-[var(--color-sand)]">
          <p className="text-sm text-[var(--color-earth-dark)]">{payload[0].name}</p>
          <p className="text-lg text-[var(--color-sage)]">
            {payload[0].value} bookings ({payload[0].payload.percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl text-[var(--color-earth-dark)] mb-2">Reports & Analytics</h1>
        <p className="text-[var(--color-stone)]">Track performance, trends, and insights</p>
      </div>

      {/* Tabs */}
      <div className="mb-8 border-b border-[var(--color-sand)]">
        <div className="flex gap-4">
          <button
            onClick={() => setActiveTab('monthly')}
            className={`px-6 py-3 border-b-2 transition-all duration-300 ${
              activeTab === 'monthly'
                ? 'border-[var(--color-sage)] text-[var(--color-sage)]'
                : 'border-transparent text-[var(--color-stone)] hover:text-[var(--color-earth-dark)]'
            }`}
          >
            Monthly Analysis
          </button>
          <button
            onClick={() => setActiveTab('yearly')}
            className={`px-6 py-3 border-b-2 transition-all duration-300 ${
              activeTab === 'yearly'
                ? 'border-[var(--color-sage)] text-[var(--color-sage)]'
                : 'border-transparent text-[var(--color-stone)] hover:text-[var(--color-earth-dark)]'
            }`}
          >
            Yearly Overview
          </button>
        </div>
      </div>

      {/* Monthly Analysis Tab */}
      {activeTab === 'monthly' && (
        <div className="space-y-8">
          {/* Month/Year Picker */}
          <div className="flex items-center justify-between">
            <MonthYearPicker
              selectedMonth={selectedMonth}
              selectedYear={selectedYear}
              onMonthChange={setSelectedMonth}
              onYearChange={setSelectedYear}
            />

            {/* Quick Stats */}
            <div className="flex gap-6">
              <div className="bg-white rounded-lg shadow-md px-6 py-3">
                <div className="text-sm text-[var(--color-stone)]">Total Bookings</div>
                <div className="text-2xl text-[var(--color-earth-dark)]">{monthlyBookings.length}</div>
              </div>
              <div className="bg-white rounded-lg shadow-md px-6 py-3">
                <div className="text-sm text-[var(--color-stone)]">Unique Classes</div>
                <div className="text-2xl text-[var(--color-earth-dark)]">{classPopularityData.length}</div>
              </div>
            </div>
          </div>

          {/* Chart 1: Peak Hours */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <TrendingUp size={20} className="text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl text-[var(--color-earth-dark)]">Peak Hours</h2>
                <p className="text-sm text-[var(--color-stone)]">Most popular time slots for classes</p>
              </div>
            </div>
            
            {peakHoursData.length > 0 ? (
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={peakHoursData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E8DFD8" />
                  <XAxis 
                    dataKey="timeSlot" 
                    stroke="#8B7F76"
                    style={{ fontSize: '14px' }}
                  />
                  <YAxis 
                    stroke="#8B7F76"
                    style={{ fontSize: '14px' }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="attendees" fill="#6B9080" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[350px] flex items-center justify-center text-[var(--color-stone)]">
                No data available for this month
              </div>
            )}
          </div>

          {/* Chart 2: Class Popularity */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                <CalendarIcon size={20} className="text-purple-600" />
              </div>
              <div>
                <h2 className="text-xl text-[var(--color-earth-dark)]">Class Popularity</h2>
                <p className="text-sm text-[var(--color-stone)]">Distribution of bookings by class type</p>
              </div>
            </div>

            {classPopularityData.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <ResponsiveContainer width="100%" height={350}>
                  <PieChart>
                    <Pie
                      data={classPopularityData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percentage }) => `${name} (${percentage}%)`}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {classPopularityData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[entry.name as keyof typeof COLORS] || '#9CA3AF'} />
                      ))}
                    </Pie>
                    <Tooltip content={<PieTooltip />} />
                  </PieChart>
                </ResponsiveContainer>

                {/* Legend with actual numbers */}
                <div className="flex flex-col justify-center space-y-3">
                  {classPopularityData.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-[var(--color-cream)] transition-colors">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-4 h-4 rounded"
                          style={{ backgroundColor: COLORS[item.name as keyof typeof COLORS] || '#9CA3AF' }}
                        />
                        <span className="text-[var(--color-earth-dark)]">{item.name}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-[var(--color-earth-dark)]">{item.value} bookings</div>
                        <div className="text-xs text-[var(--color-stone)]">{item.percentage}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="h-[350px] flex items-center justify-center text-[var(--color-stone)]">
                No data available for this month
              </div>
            )}
          </div>
        </div>
      )}

      {/* Yearly Overview Tab */}
      {activeTab === 'yearly' && (
        <div className="space-y-8">
          {/* Year Picker */}
          <div className="flex items-center justify-between">
            <MonthYearPicker
              selectedMonth={0} // Not used for yearly view
              selectedYear={yearlyViewYear}
              onMonthChange={() => {}} // No-op for yearly view
              onYearChange={setYearlyViewYear}
              showMonthOnly={true}
            />

            {/* Quick Stats */}
            <div className="flex gap-6">
              <div className="bg-white rounded-lg shadow-md px-6 py-3">
                <div className="text-sm text-[var(--color-stone)]">Annual Bookings</div>
                <div className="text-2xl text-[var(--color-earth-dark)]">{yearlyBookings.length}</div>
              </div>
              <div className="bg-white rounded-lg shadow-md px-6 py-3">
                <div className="text-sm text-[var(--color-stone)]">Nationalities</div>
                <div className="text-2xl text-[var(--color-earth-dark)]">{topNationalities.length}</div>
              </div>
            </div>
          </div>

          {/* Chart 3: Nationality Trends */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                <Users size={20} className="text-green-600" />
              </div>
              <div>
                <h2 className="text-xl text-[var(--color-earth-dark)]">Nationality Trends</h2>
                <p className="text-sm text-[var(--color-stone)]">Track visitor patterns by nationality throughout the year</p>
              </div>
            </div>

            {nationalityTrendsData.length > 0 && topNationalities.length > 0 ? (
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={nationalityTrendsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E8DFD8" />
                  <XAxis 
                    dataKey="month" 
                    stroke="#8B7F76"
                    style={{ fontSize: '14px' }}
                  />
                  <YAxis 
                    stroke="#8B7F76"
                    style={{ fontSize: '14px' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #E8DFD8',
                      borderRadius: '8px',
                      padding: '12px'
                    }}
                  />
                  <Legend />
                  {topNationalities.map((nationality, index) => (
                    <Line
                      key={nationality}
                      type="monotone"
                      dataKey={nationality}
                      stroke={NATIONALITY_COLORS[nationality as keyof typeof NATIONALITY_COLORS] || NATIONALITY_COLORS.Other}
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[400px] flex items-center justify-center text-[var(--color-stone)]">
                No data available for this year
              </div>
            )}
          </div>

          {/* Chart 4: Most Popular Classes of the Year */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                <TrendingUp size={20} className="text-orange-600" />
              </div>
              <div>
                <h2 className="text-xl text-[var(--color-earth-dark)]">Most Popular Classes of {yearlyViewYear}</h2>
                <p className="text-sm text-[var(--color-stone)]">Ranking by total annual bookings</p>
              </div>
            </div>

            {popularClassesYearlyData.length > 0 ? (
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={popularClassesYearlyData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#E8DFD8" />
                  <XAxis 
                    type="number"
                    stroke="#8B7F76"
                    style={{ fontSize: '14px' }}
                  />
                  <YAxis 
                    dataKey="classType" 
                    type="category"
                    stroke="#8B7F76"
                    style={{ fontSize: '14px' }}
                    width={120}
                  />
                  <Tooltip
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #E8DFD8',
                      borderRadius: '8px',
                      padding: '12px'
                    }}
                  />
                  <Bar dataKey="bookings" radius={[0, 8, 8, 0]}>
                    {popularClassesYearlyData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[entry.classType as keyof typeof COLORS] || '#9CA3AF'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[350px] flex items-center justify-center text-[var(--color-stone)]">
                No data available for this year
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}