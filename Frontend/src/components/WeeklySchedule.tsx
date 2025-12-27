import { Calendar, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ClassDetailModal } from './ClassDetailModal';

interface WeeklyScheduleProps {
  onNavigate: (page: string) => void;
}

type ViewMode = 'day' | 'week' | 'month';

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const calendarDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export function WeeklySchedule({ onNavigate }: WeeklyScheduleProps) {
  const { classes } = useApp();
  const [viewMode, setViewMode] = useState<ViewMode>('week');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentWeekStart, setCurrentWeekStart] = useState(getWeekStart(new Date()));
  const [selectedClass, setSelectedClass] = useState<any>(null);

  // Helper function to get the start of the week (Monday)
  function getWeekStart(date: Date): Date {
    const d = new Date(date);
    const day = d.getDay();
    const diff = day === 0 ? -6 : 1 - day; // Adjust to Monday
    d.setDate(d.getDate() + diff);
    d.setHours(0, 0, 0, 0);
    return d;
  }

  // Generate array of dates for the current week
  function getWeekDates(weekStart: Date): Date[] {
    const dates: Date[] = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(weekStart);
      date.setDate(weekStart.getDate() + i);
      dates.push(date);
    }
    return dates;
  }

  // Format date as "Mon 29 Dec"
  function formatDateLabel(date: Date): string {
    const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
    const day = date.getDate();
    const month = date.toLocaleDateString('en-US', { month: 'short' });
    return `${dayName} ${day} ${month}`;
  }

  // Get day name from date (e.g., "Monday")
  function getDayName(date: Date): string {
    return calendarDays[date.getDay()];
  }

  const getLevelColor = (level: string) => {
    if (level === 'Beginner') return 'bg-[var(--color-sage)]/30 text-[var(--color-clay)]';
    if (level === 'Intermediate') return 'bg-[var(--color-terracotta)]/30 text-[var(--color-clay)]';
    if (level === 'Advanced') return 'bg-[var(--color-stone)]/30 text-[var(--color-earth-dark)]';
    return 'bg-[var(--color-sand)]/50 text-[var(--color-clay)]';
  };

  // Get current day name
  const getCurrentDayName = (date: Date) => {
    const dayIndex = date.getDay();
    return daysOfWeek[dayIndex === 0 ? 6 : dayIndex - 1];
  };

  // Navigation handlers
  const handlePrevious = () => {
    if (viewMode === 'day') {
      const newDate = new Date(selectedDate);
      newDate.setDate(newDate.getDate() - 1);
      setSelectedDate(newDate);
    } else if (viewMode === 'week') {
      const newWeekStart = new Date(currentWeekStart);
      newWeekStart.setDate(newWeekStart.getDate() - 7);
      setCurrentWeekStart(newWeekStart);
      setSelectedDate(newWeekStart);
    } else {
      const newDate = new Date(selectedDate);
      newDate.setMonth(newDate.getMonth() - 1);
      setSelectedDate(newDate);
    }
  };

  const handleNext = () => {
    if (viewMode === 'day') {
      const newDate = new Date(selectedDate);
      newDate.setDate(newDate.getDate() + 1);
      setSelectedDate(newDate);
    } else if (viewMode === 'week') {
      const newWeekStart = new Date(currentWeekStart);
      newWeekStart.setDate(newWeekStart.getDate() + 7);
      setCurrentWeekStart(newWeekStart);
      setSelectedDate(newWeekStart);
    } else {
      const newDate = new Date(selectedDate);
      newDate.setMonth(newDate.getMonth() + 1);
      setSelectedDate(newDate);
    }
  };

  const handleToday = () => {
    const today = new Date();
    setSelectedDate(today);
    setCurrentWeekStart(getWeekStart(today));
  };

  // Filter classes based on view mode
  const getFilteredClasses = () => {
    if (viewMode === 'day') {
      const dayName = getCurrentDayName(selectedDate);
      return classes.filter(cls => cls.day === dayName);
    } else if (viewMode === 'week') {
      return classes;
    } else {
      // Month view - show all classes
      return classes;
    }
  };

  const filteredClasses = getFilteredClasses();

  // Group classes by day for week/month view
  const groupedClasses = daysOfWeek.reduce((acc, day) => {
    acc[day] = filteredClasses.filter(cls => cls.day === day);
    return acc;
  }, {} as Record<string, typeof classes>);

  // Calendar grid generation for month view
  const generateCalendarGrid = () => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    
    // Get first day of month (0 = Sunday, 1 = Monday, etc.)
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    
    // Get number of days in month
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    // Get number of days in previous month
    const daysInPrevMonth = new Date(year, month, 0).getDate();
    
    const calendarCells = [];
    
    // Add empty cells for days from previous month
    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
      calendarCells.push({
        date: daysInPrevMonth - i,
        isCurrentMonth: false,
        fullDate: new Date(year, month - 1, daysInPrevMonth - i),
      });
    }
    
    // Add cells for current month
    for (let day = 1; day <= daysInMonth; day++) {
      calendarCells.push({
        date: day,
        isCurrentMonth: true,
        fullDate: new Date(year, month, day),
      });
    }
    
    // Add cells for next month to complete the grid
    const remainingCells = 42 - calendarCells.length; // 6 rows * 7 days
    for (let day = 1; day <= remainingCells; day++) {
      calendarCells.push({
        date: day,
        isCurrentMonth: false,
        fullDate: new Date(year, month + 1, day),
      });
    }
    
    return calendarCells;
  };

  // Get classes for a specific date
  const getClassesForDate = (date: Date) => {
    const dayName = calendarDays[date.getDay()];
    return classes.filter(cls => cls.day === dayName);
  };

  // Check if a date is today
  const isToday = (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };

  // Handle day cell click in month view
  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
    setViewMode('day');
  };

  return (
    <>
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          {/* Header with View Switcher */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
            <div className="flex items-center gap-3">
              <Calendar size={28} className="text-[var(--color-clay)]" />
              <h2 className="text-[var(--color-earth-dark)]">Class Schedule</h2>
            </div>

            {/* View Mode Switcher */}
            <div className="flex items-center gap-2 bg-[var(--color-cream)] rounded-lg p-1">
              {(['day', 'week', 'month'] as ViewMode[]).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={`px-6 py-2 rounded-lg transition-all duration-300 capitalize ${
                    viewMode === mode
                      ? 'bg-[var(--color-sage)] text-white shadow-md'
                      : 'text-[var(--color-stone)] hover:text-[var(--color-earth-dark)]'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={handlePrevious}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--color-cream)] hover:bg-[var(--color-sand)] transition-colors duration-300"
            >
              <ChevronLeft size={20} />
              <span>Previous</span>
            </button>

            <div className="text-center">
              <div className="inline-block bg-[var(--color-sand)] px-6 py-3 rounded-full">
                <p className="text-[var(--color-earth-dark)]">
                  {viewMode === 'day' && `${getCurrentDayName(selectedDate)}, ${selectedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`}
                  {viewMode === 'week' && 'Full Week Schedule'}
                  {viewMode === 'month' && selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </p>
              </div>
              <button
                onClick={handleToday}
                className="mt-2 text-sm text-[var(--color-sage)] hover:text-[var(--color-clay)] transition-colors duration-300"
              >
                Go to Today
              </button>
            </div>

            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--color-cream)] hover:bg-[var(--color-sand)] transition-colors duration-300"
            >
              <span>Next</span>
              <ChevronRight size={20} />
            </button>
          </div>

          {/* Day View */}
          {viewMode === 'day' && (
            <div className="bg-[var(--color-cream)] rounded-lg overflow-hidden shadow-lg">
              <div className="divide-y divide-[var(--color-sand)]">
                {filteredClasses.length > 0 ? (
                  filteredClasses.map((classItem) => (
                    <button
                      key={classItem.id}
                      onClick={() => setSelectedClass(classItem)}
                      className="w-full grid grid-cols-1 md:grid-cols-5 gap-2 md:gap-4 p-6 hover:bg-white transition-colors duration-200 text-left"
                    >
                      <div className="flex items-center gap-2">
                        <Clock size={18} className="text-[var(--color-clay)]" />
                        <span className="text-[var(--color-earth-dark)]">{classItem.time}</span>
                      </div>
                      <div className="text-[var(--color-earth-dark)] md:col-span-2">
                        {classItem.title}
                      </div>
                      <div className="text-[var(--color-stone)]">{classItem.instructor}</div>
                      <div className="flex items-center">
                        <span className={`inline-block px-3 py-1 rounded-full text-sm ${getLevelColor(classItem.level)}`}>
                          {classItem.level}
                        </span>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="p-12 text-center text-[var(--color-stone)]">
                    No classes scheduled for this day
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Week View */}
          {viewMode === 'week' && (() => {
            const weekDates = getWeekDates(currentWeekStart);
            return (
              <div className="space-y-8">
                {weekDates.map((date, index) => {
                  const dayName = getDayName(date);
                  const dateLabel = formatDateLabel(date);
                  const dayClasses = groupedClasses[dayName] || [];
                  const isCurrentDay = isToday(date);
                  
                  return (
                    <div key={index}>
                      <div className="flex items-center gap-3 mb-4">
                        <h3 className={`text-[var(--color-earth-dark)] ${isCurrentDay ? 'text-[var(--color-sage)]' : ''}`}>
                          {dateLabel}
                        </h3>
                        {isCurrentDay && (
                          <span className="px-3 py-1 bg-[var(--color-sage)] text-white text-xs rounded-full">
                            Today
                          </span>
                        )}
                      </div>
                      <div className="bg-[var(--color-cream)] rounded-lg overflow-hidden shadow-lg">
                        <div className="divide-y divide-[var(--color-sand)]">
                          {dayClasses.length > 0 ? (
                            dayClasses.map((classItem) => (
                              <button
                                key={classItem.id}
                                onClick={() => setSelectedClass(classItem)}
                                className="w-full grid grid-cols-1 md:grid-cols-5 gap-2 md:gap-4 p-6 hover:bg-white transition-colors duration-200 text-left"
                              >
                                <div className="flex items-center gap-2">
                                  <Clock size={18} className="text-[var(--color-clay)]" />
                                  <span className="text-[var(--color-earth-dark)]">{classItem.time}</span>
                                </div>
                                <div className="text-[var(--color-earth-dark)] md:col-span-2">
                                  {classItem.title}
                                </div>
                                <div className="text-[var(--color-stone)]">{classItem.instructor}</div>
                                <div className="flex items-center">
                                  <span className={`inline-block px-3 py-1 rounded-full text-sm ${getLevelColor(classItem.level)}`}>
                                    {classItem.level}
                                  </span>
                                </div>
                              </button>
                            ))
                          ) : (
                            <div className="p-8 text-center text-[var(--color-stone)] text-sm">
                              No classes scheduled
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })()}

          {/* Month View - Grid Layout */}
          {viewMode === 'month' && (
            <div className="bg-[var(--color-cream)] rounded-lg shadow-lg overflow-hidden">
              {/* Calendar Header - Day Names */}
              <div className="grid grid-cols-7 bg-[var(--color-sage)] text-white">
                {calendarDays.map((day) => (
                  <div key={day} className="p-3 text-center text-sm border-r border-white/20 last:border-r-0">
                    {day.slice(0, 3)}
                  </div>
                ))}
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 bg-white">
                {generateCalendarGrid().map((cell, index) => {
                  const dayClasses = getClassesForDate(cell.fullDate);
                  const isCurrentDay = isToday(cell.fullDate);
                  const maxDisplayClasses = 2;
                  const hasMoreClasses = dayClasses.length > maxDisplayClasses;
                  
                  return (
                    <button
                      key={index}
                      onClick={() => handleDayClick(cell.fullDate)}
                      className={`min-h-[120px] p-2 border border-[var(--color-sand)] hover:bg-[var(--color-cream)] transition-colors duration-200 text-left relative ${
                        !cell.isCurrentMonth ? 'bg-gray-50 text-gray-400' : 'bg-white'
                      } ${isCurrentDay ? 'ring-2 ring-[var(--color-sage)] ring-inset' : ''}`}
                    >
                      {/* Date Number */}
                      <div className={`mb-2 flex items-center justify-between ${
                        isCurrentDay ? 'bg-[var(--color-sage)] text-white rounded-full w-7 h-7 flex items-center justify-center' : ''
                      }`}>
                        <span className={`text-sm ${
                          !cell.isCurrentMonth ? 'text-gray-400' : 'text-[var(--color-earth-dark)]'
                        } ${isCurrentDay ? 'text-white mx-auto' : ''}`}>
                          {cell.date}
                        </span>
                      </div>

                      {/* Class Indicators */}
                      {cell.isCurrentMonth && dayClasses.length > 0 && (
                        <div className="space-y-1">
                          {dayClasses.slice(0, maxDisplayClasses).map((classItem, idx) => (
                            <div
                              key={idx}
                              className="text-xs p-1 bg-[var(--color-sage)]/20 rounded truncate hover:bg-[var(--color-sage)]/30 transition-colors"
                            >
                              <div className="flex items-center gap-1">
                                <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-sage)] flex-shrink-0"></div>
                                <span className="truncate text-[var(--color-earth-dark)]">
                                  {classItem.time.split(' ')[0]} {classItem.title}
                                </span>
                              </div>
                            </div>
                          ))}
                          
                          {/* +X More Label */}
                          {hasMoreClasses && (
                            <div className="text-xs text-[var(--color-clay)] pl-1">
                              +{dayClasses.length - maxDisplayClasses} more
                            </div>
                          )}
                        </div>
                      )}

                      {/* Empty state for days with no classes */}
                      {cell.isCurrentMonth && dayClasses.length === 0 && (
                        <div className="text-xs text-gray-400 text-center mt-4">
                          No classes
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Note */}
          <div className="mt-8 text-center">
            <p className="text-sm text-[var(--color-stone)] italic">
              Click on any class to view details and book your spot. Arrive 15 minutes early!
            </p>
          </div>
        </div>
      </section>

      {/* Class Detail Modal */}
      {selectedClass && (
        <ClassDetailModal
          classData={selectedClass}
          onClose={() => setSelectedClass(null)}
          onNavigate={onNavigate}
        />
      )}
    </>
  );
}