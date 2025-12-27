import { useState } from 'react';
import { Plus, Trash2, Calendar, Zap, Clock } from 'lucide-react';
import { useApp } from '../context/AppContext';

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const instructors = [
  { id: 'annie', name: 'Annie Bliss' },
  { id: 'sarah', name: 'Sarah Chen' },
  { id: 'mike', name: 'Mike Johnson' },
  { id: 'maya', name: 'Maya Rodriguez' },
];
const rooms = ['Studio A', 'Studio B', 'Outdoor Space'];

export function ScheduleGeneratorTab() {
  const { classTypes, weeklySlots, addWeeklySlot, deleteWeeklySlot, addClass } = useApp();
  const [showAddSlot, setShowAddSlot] = useState(false);
  const [selectedDay, setSelectedDay] = useState('');
  const [slotData, setSlotData] = useState({
    classTypeId: '',
    day: '',
    time: '09:00',
    instructorId: '',
    room: 'Studio A'
  });

  const handleAddSlot = () => {
    if (!slotData.classTypeId || !slotData.day || !slotData.time || !slotData.instructorId) {
      alert('Please fill in all fields');
      return;
    }

    const instructor = instructors.find(i => i.id === slotData.instructorId);
    const timeFormatted = formatTime(slotData.time);
    
    addWeeklySlot({
      classTypeId: slotData.classTypeId,
      day: slotData.day,
      time: timeFormatted,
      instructorId: slotData.instructorId,
      room: slotData.room
    });

    setSlotData({
      classTypeId: '',
      day: '',
      time: '09:00',
      instructorId: '',
      room: 'Studio A'
    });
    setShowAddSlot(false);
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  const handleGenerateSchedule = () => {
    const monthInput = prompt('Enter target month (1-12):');
    const yearInput = prompt('Enter target year (e.g., 2026):');
    
    if (!monthInput || !yearInput) return;
    
    const month = parseInt(monthInput);
    const year = parseInt(yearInput);
    
    if (month < 1 || month > 12 || year < 2024) {
      alert('Invalid month or year');
      return;
    }

    if (weeklySlots.length === 0) {
      alert('Please add at least one weekly slot before generating a schedule');
      return;
    }

    generateSchedule(year, month);
  };

  const generateSchedule = (year: number, month: number) => {
    const daysInMonth = new Date(year, month, 0).getDate();
    let classesCreated = 0;

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month - 1, day);
      const dayName = getDayName(date);

      // Find all slots for this day
      const slotsForDay = weeklySlots.filter(slot => slot.day === dayName);

      slotsForDay.forEach(slot => {
        const classType = classTypes.find(ct => ct.id === slot.classTypeId);
        const instructor = instructors.find(i => i.id === slot.instructorId);

        if (classType && instructor) {
          addClass({
            title: classType.title,
            time: slot.time,
            instructor: instructor.name,
            level: classType.level,
            capacity: 20,
            enrolled: 0,
            day: dayName,
            duration: `${classType.defaultDuration} min`,
            description: classType.description,
            room: slot.room,
            category: 'class'
          });
          classesCreated++;
        }
      });
    }

    alert(`Successfully generated ${classesCreated} class sessions for ${getMonthName(month)} ${year}!`);
  };

  const getDayName = (date: Date) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[date.getDay()];
  };

  const getMonthName = (month: number) => {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return months[month - 1];
  };

  const getSlotsByDay = (day: string) => {
    return weeklySlots.filter(slot => slot.day === day).sort((a, b) => {
      const timeA = a.time.toLowerCase().replace(/\s/g, '');
      const timeB = b.time.toLowerCase().replace(/\s/g, '');
      return timeA.localeCompare(timeB);
    });
  };

  const getClassTypeName = (classTypeId: string) => {
    return classTypes.find(ct => ct.id === classTypeId)?.title || 'Unknown';
  };

  const getClassTypeColor = (classTypeId: string) => {
    return classTypes.find(ct => ct.id === classTypeId)?.color || '#8CA899';
  };

  const getInstructorName = (instructorId: string) => {
    return instructors.find(i => i.id === instructorId)?.name || 'Unknown';
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl text-[var(--color-earth-dark)] mb-1">Weekly Schedule Planner</h2>
          <p className="text-sm text-[var(--color-stone)]">Build your weekly pattern and generate monthly schedules</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowAddSlot(true)}
            className="bg-[var(--color-sage)] hover:bg-[var(--color-clay)] text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-all duration-300 shadow-md hover:shadow-lg"
          >
            <Plus size={20} />
            <span>Add Slot</span>
          </button>
          <button
            onClick={handleGenerateSchedule}
            className="bg-[var(--color-clay)] hover:bg-[var(--color-earth-dark)] text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-all duration-300 shadow-md hover:shadow-lg"
          >
            <Zap size={20} />
            <span>Generate Schedule</span>
          </button>
        </div>
      </div>

      {classTypes.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <div className="w-24 h-24 rounded-full bg-[var(--color-cream)] mx-auto mb-4 flex items-center justify-center">
            <Calendar size={40} className="text-[var(--color-sage)]" />
          </div>
          <h3 className="text-xl text-[var(--color-earth-dark)] mb-2">No Class Types Available</h3>
          <p className="text-[var(--color-stone)]">
            Please create class types first in the "Class Types (Templates)" tab before building your weekly schedule.
          </p>
        </div>
      ) : (
        <>
          {/* Weekly Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
            {daysOfWeek.map(day => {
              const slots = getSlotsByDay(day);
              return (
                <div key={day} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="bg-[var(--color-sage)] text-white p-3 text-center">
                    <h3 className="text-sm uppercase tracking-wide">{day.slice(0, 3)}</h3>
                  </div>
                  <div className="p-3 min-h-[200px]">
                    {slots.length === 0 ? (
                      <div className="text-center text-[var(--color-stone)] text-xs py-8">
                        No slots
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {slots.map(slot => (
                          <div
                            key={slot.id}
                            className="p-2 rounded-lg text-xs relative group hover:shadow-md transition-shadow duration-300"
                            style={{ backgroundColor: `${getClassTypeColor(slot.classTypeId)}20` }}
                          >
                            <button
                              onClick={() => deleteWeeklySlot(slot.id)}
                              className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
                            >
                              <Trash2 size={12} />
                            </button>
                            <div className="flex items-center gap-1 mb-1">
                              <Clock size={10} />
                              <span className="text-[var(--color-earth-dark)]">{slot.time}</span>
                            </div>
                            <div
                              className="mb-1 truncate text-[var(--color-earth-dark)]"
                              title={getClassTypeName(slot.classTypeId)}
                            >
                              {getClassTypeName(slot.classTypeId)}
                            </div>
                            <div className="text-[var(--color-stone)] text-xs truncate">
                              {getInstructorName(slot.instructorId)}
                            </div>
                            <div className="text-[var(--color-stone)] text-xs">
                              {slot.room}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Info Box */}
          <div className="mt-6 bg-gradient-to-r from-[var(--color-sage)]/10 to-[var(--color-clay)]/10 p-6 rounded-lg">
            <h4 className="text-lg text-[var(--color-earth-dark)] mb-2">How it works:</h4>
            <ol className="list-decimal list-inside space-y-2 text-sm text-[var(--color-stone)]">
              <li>Add weekly slots by clicking "Add Slot" and selecting a class type, day, time, and instructor</li>
              <li>Build your ideal weekly schedule pattern by adding all recurring classes</li>
              <li>Click "Generate Schedule" and enter a target month/year</li>
              <li>The system will create individual class instances for every day of that month based on your weekly pattern</li>
              <li>Generated classes will appear in your main classes list and on the public schedule page</li>
            </ol>
          </div>
        </>
      )}

      {/* Add Slot Modal */}
      {showAddSlot && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowAddSlot(false)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-[var(--color-sand)]">
              <h2 className="text-2xl text-[var(--color-earth-dark)]">Add Weekly Slot</h2>
              <button
                onClick={() => setShowAddSlot(false)}
                className="p-2 hover:bg-[var(--color-cream)] rounded-full transition-colors duration-300"
              >
                <Plus size={24} className="rotate-45" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Class Type */}
              <div>
                <label className="block text-sm text-[var(--color-stone)] mb-2">
                  Class Type *
                </label>
                <select
                  value={slotData.classTypeId}
                  onChange={(e) => setSlotData({ ...slotData, classTypeId: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-[var(--color-sand)] focus:ring-2 focus:ring-[var(--color-sage)] focus:border-transparent transition-all duration-300"
                >
                  <option value="">Select a class type...</option>
                  {classTypes.map(ct => (
                    <option key={ct.id} value={ct.id}>{ct.title}</option>
                  ))}
                </select>
              </div>

              {/* Day */}
              <div>
                <label className="block text-sm text-[var(--color-stone)] mb-2">
                  Day of Week *
                </label>
                <select
                  value={slotData.day}
                  onChange={(e) => setSlotData({ ...slotData, day: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-[var(--color-sand)] focus:ring-2 focus:ring-[var(--color-sage)] focus:border-transparent transition-all duration-300"
                >
                  <option value="">Select a day...</option>
                  {daysOfWeek.map(day => (
                    <option key={day} value={day}>{day}</option>
                  ))}
                </select>
              </div>

              {/* Time */}
              <div>
                <label className="block text-sm text-[var(--color-stone)] mb-2">
                  Time *
                </label>
                <input
                  type="time"
                  value={slotData.time}
                  onChange={(e) => setSlotData({ ...slotData, time: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-[var(--color-sand)] focus:ring-2 focus:ring-[var(--color-sage)] focus:border-transparent transition-all duration-300"
                />
              </div>

              {/* Instructor */}
              <div>
                <label className="block text-sm text-[var(--color-stone)] mb-2">
                  Instructor *
                </label>
                <select
                  value={slotData.instructorId}
                  onChange={(e) => setSlotData({ ...slotData, instructorId: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-[var(--color-sand)] focus:ring-2 focus:ring-[var(--color-sage)] focus:border-transparent transition-all duration-300"
                >
                  <option value="">Select an instructor...</option>
                  {instructors.map(instructor => (
                    <option key={instructor.id} value={instructor.id}>{instructor.name}</option>
                  ))}
                </select>
              </div>

              {/* Room */}
              <div>
                <label className="block text-sm text-[var(--color-stone)] mb-2">
                  Room *
                </label>
                <select
                  value={slotData.room}
                  onChange={(e) => setSlotData({ ...slotData, room: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-[var(--color-sand)] focus:ring-2 focus:ring-[var(--color-sage)] focus:border-transparent transition-all duration-300"
                >
                  {rooms.map(room => (
                    <option key={room} value={room}>{room}</option>
                  ))}
                </select>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--color-sand)]">
                <button
                  onClick={() => setShowAddSlot(false)}
                  className="px-6 py-3 rounded-lg text-[var(--color-stone)] hover:bg-[var(--color-cream)] transition-colors duration-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddSlot}
                  className="bg-[var(--color-sage)] hover:bg-[var(--color-clay)] text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  <Plus size={20} />
                  <span>Add Slot</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
