import { X } from 'lucide-react';
import { useState } from 'react';
import { useApp } from '../context/AppContext';

interface CreateClassModalProps {
  onClose: () => void;
}

export function CreateClassModal({ onClose }: CreateClassModalProps) {
  const { addClass } = useApp();
  const [formData, setFormData] = useState({
    title: '',
    time: '',
    instructor: '',
    level: 'All Levels',
    capacity: 20,
    day: 'Monday',
    duration: '60 min',
    description: '',
    room: 'Studio A'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addClass({
      ...formData,
      enrolled: 0
    });
    alert('Class created successfully!');
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'capacity' ? parseInt(value) : value
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div 
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative bg-gradient-to-br from-[var(--color-sage)] to-[var(--color-clay)] text-white p-8 rounded-t-2xl">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors duration-300"
          >
            <X size={24} />
          </button>
          
          <h2 className="text-white">Create New Class</h2>
          <p className="text-white/90 mt-2">Add a new class to the schedule</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* Class Title */}
          <div>
            <label className="block text-sm text-[var(--color-stone)] mb-2">
              Class Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="e.g., Morning Flow"
              className="w-full px-4 py-3 border border-[var(--color-sand)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-sage)] transition-all duration-300"
            />
          </div>

          {/* Day and Time Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-[var(--color-stone)] mb-2">
                Day *
              </label>
              <select
                name="day"
                value={formData.day}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-[var(--color-sand)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-sage)] transition-all duration-300"
              >
                <option value="Monday">Monday</option>
                <option value="Tuesday">Tuesday</option>
                <option value="Wednesday">Wednesday</option>
                <option value="Thursday">Thursday</option>
                <option value="Friday">Friday</option>
                <option value="Saturday">Saturday</option>
                <option value="Sunday">Sunday</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-[var(--color-stone)] mb-2">
                Time *
              </label>
              <input
                type="text"
                name="time"
                value={formData.time}
                onChange={handleChange}
                required
                placeholder="e.g., 07:00 AM"
                className="w-full px-4 py-3 border border-[var(--color-sand)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-sage)] transition-all duration-300"
              />
            </div>
          </div>

          {/* Instructor and Level Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-[var(--color-stone)] mb-2">
                Instructor *
              </label>
              <input
                type="text"
                name="instructor"
                value={formData.instructor}
                onChange={handleChange}
                required
                placeholder="e.g., Annie Bliss"
                className="w-full px-4 py-3 border border-[var(--color-sand)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-sage)] transition-all duration-300"
              />
            </div>

            <div>
              <label className="block text-sm text-[var(--color-stone)] mb-2">
                Level *
              </label>
              <select
                name="level"
                value={formData.level}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-[var(--color-sand)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-sage)] transition-all duration-300"
              >
                <option value="All Levels">All Levels</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
          </div>

          {/* Duration, Room, and Capacity Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-[var(--color-stone)] mb-2">
                Duration *
              </label>
              <select
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-[var(--color-sand)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-sage)] transition-all duration-300"
              >
                <option value="45 min">45 min</option>
                <option value="60 min">60 min</option>
                <option value="75 min">75 min</option>
                <option value="90 min">90 min</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-[var(--color-stone)] mb-2">
                Room *
              </label>
              <select
                name="room"
                value={formData.room}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-[var(--color-sand)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-sage)] transition-all duration-300"
              >
                <option value="Studio A">Studio A</option>
                <option value="Studio B">Studio B</option>
                <option value="Studio C">Studio C</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-[var(--color-stone)] mb-2">
                Capacity *
              </label>
              <input
                type="number"
                name="capacity"
                value={formData.capacity}
                onChange={handleChange}
                required
                min="1"
                max="50"
                className="w-full px-4 py-3 border border-[var(--color-sand)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-sage)] transition-all duration-300"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm text-[var(--color-stone)] mb-2">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={4}
              placeholder="Describe the class, what to expect, and who it's for..."
              className="w-full px-4 py-3 border border-[var(--color-sand)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-sage)] transition-all duration-300 resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border-2 border-[var(--color-sand)] text-[var(--color-stone)] rounded-lg hover:bg-[var(--color-cream)] transition-all duration-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-[var(--color-sage)] hover:bg-[var(--color-clay)] text-white rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Create Class
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
