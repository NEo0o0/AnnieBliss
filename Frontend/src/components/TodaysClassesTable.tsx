import { useState } from 'react';
import React from 'react';
import { 
  Clock, 
  ChevronDown, 
  Phone, 
  MessageCircle, 
  Instagram, 
  Facebook, 
  AlertCircle,
  UserCheck,
  ExternalLink,
  UserPlus,
  Users,
  DollarSign,
  CheckCircle
} from 'lucide-react';

interface Booking {
  id: string;
  studentId: string;
  name: string;
  avatar: string;
  phone: string;
  contactInfo: string;
  contactPlatform: string;
  status: 'confirmed' | 'checked-in';
  bookingTime: string;
  isGuest?: boolean; // Flag to indicate if this is a guest booking
  user_id?: string | null; // null for guest bookings
  guest_name?: string | null;
  guest_contact?: string | null;
  paymentStatus?: 'paid' | 'unpaid'; // Payment status for guest bookings
  paymentAmount?: number; // Amount if payment was made
}

interface ClassItem {
  id: number;
  name: string;
  time: string;
  booked: number;
  capacity: number;
  instructor: string;
  bookings?: Booking[];
}

interface TodaysClassesTableProps {
  classes: ClassItem[];
  bookings: Record<number, Booking[]>;
  onManualBooking?: (classId: number, className: string, classTime: string) => void;
  onMarkAsPaid?: (bookingId: string, classId: number, className: string, amount: number) => void;
}

export function TodaysClassesTable({ classes, bookings, onManualBooking, onMarkAsPaid }: TodaysClassesTableProps) {
  const [expandedClassId, setExpandedClassId] = useState<number | null>(null);
  const [checkedInStudents, setCheckedInStudents] = useState<Set<string>>(
    new Set(
      // Pre-populate with already checked-in students
      Object.values(bookings)
        .flat()
        .filter(b => b.status === 'checked-in')
        .map(b => b.id)
    )
  );

  const toggleRow = (classId: number) => {
    setExpandedClassId(expandedClassId === classId ? null : classId);
  };

  const handleCheckIn = (bookingId: string) => {
    setCheckedInStudents(prev => {
      const newSet = new Set(prev);
      if (newSet.has(bookingId)) {
        newSet.delete(bookingId);
      } else {
        newSet.add(bookingId);
      }
      return newSet;
    });
  };

  const getCapacityColor = (booked: number, capacity: number) => {
    const percentage = (booked / capacity) * 100;
    if (percentage >= 90) return 'text-red-600';
    if (percentage >= 70) return 'text-orange-600';
    return 'text-green-600';
  };

  const getCapacityBg = (booked: number, capacity: number) => {
    const percentage = (booked / capacity) * 100;
    if (percentage >= 90) return 'bg-red-100';
    if (percentage >= 70) return 'bg-orange-100';
    return 'bg-green-100';
  };

  const getContactIcon = (platform: string) => {
    switch (platform) {
      case 'line':
        return <MessageCircle size={16} className="text-green-600" />;
      case 'instagram':
        return <Instagram size={16} className="text-pink-600" />;
      case 'facebook':
        return <Facebook size={16} className="text-blue-600" />;
      case 'whatsapp':
        return <MessageCircle size={16} className="text-green-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="px-4 md:px-6 py-4 border-b border-[var(--color-sand)] flex items-center justify-between">
        <h3 className="text-base md:text-lg text-[var(--color-earth-dark)]">Today's Classes</h3>
        <span className="text-sm text-[var(--color-stone)]">{classes.length} classes</span>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-[var(--color-cream)]">
            <tr>
              <th className="px-4 md:px-6 py-3 text-left text-xs uppercase tracking-wider text-[var(--color-stone)]">
                Class Name
              </th>
              <th className="px-4 md:px-6 py-3 text-left text-xs uppercase tracking-wider text-[var(--color-stone)] hidden sm:table-cell">
                Time
              </th>
              <th className="px-4 md:px-6 py-3 text-left text-xs uppercase tracking-wider text-[var(--color-stone)] hidden md:table-cell">
                Instructor
              </th>
              <th className="px-4 md:px-6 py-3 text-left text-xs uppercase tracking-wider text-[var(--color-stone)]">
                Booked
              </th>
              <th className="px-4 md:px-6 py-3 text-center text-xs uppercase tracking-wider text-[var(--color-stone)]">
                
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-sand)]">
            {classes.map((classItem) => {
              const isExpanded = expandedClassId === classItem.id;
              const classBookings = bookings[classItem.id] || [];
              
              return (
                <React.Fragment key={classItem.id}>
                  {/* Main Class Row */}
                  <tr 
                    onClick={() => toggleRow(classItem.id)}
                    className="hover:bg-[var(--color-cream)]/50 transition-colors duration-150 cursor-pointer"
                  >
                    <td className="px-4 md:px-6 py-4">
                      <div className="text-sm md:text-base text-[var(--color-earth-dark)]">{classItem.name}</div>
                      <div className="text-xs text-[var(--color-stone)] sm:hidden">{classItem.time}</div>
                    </td>
                    <td className="px-4 md:px-6 py-4 hidden sm:table-cell">
                      <div className="flex items-center gap-2 text-[var(--color-stone)] text-sm">
                        <Clock size={14} />
                        {classItem.time}
                      </div>
                    </td>
                    <td className="px-4 md:px-6 py-4 hidden md:table-cell">
                      <div className="text-sm text-[var(--color-stone)]">{classItem.instructor}</div>
                    </td>
                    <td className="px-4 md:px-6 py-4">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <span className={`text-base md:text-lg ${getCapacityColor(classItem.booked, classItem.capacity)}`}>
                          {classItem.booked}/{classItem.capacity}
                        </span>
                        <span className={`px-2 md:px-3 py-1 rounded-full text-xs ${getCapacityBg(classItem.booked, classItem.capacity)} ${getCapacityColor(classItem.booked, classItem.capacity)}`}>
                          {classItem.booked === classItem.capacity ? 'Full' : `${classItem.capacity - classItem.booked} spots`}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 md:px-6 py-4 text-center">
                      <ChevronDown 
                        size={20} 
                        className={`inline-block text-[var(--color-stone)] transition-transform duration-300 ${
                          isExpanded ? 'rotate-180' : ''
                        }`}
                      />
                    </td>
                  </tr>

                  {/* Expanded Student List Row */}
                  {isExpanded && (
                    <tr>
                      <td colSpan={5} className="px-4 md:px-6 py-0">
                        <div className="bg-[var(--color-cream)]/30 py-4 animate-fadeIn">
                          {classBookings.length === 0 ? (
                            <div className="text-center py-8 text-[var(--color-stone)]">
                              <p>No students registered yet</p>
                            </div>
                          ) : (
                            <div className="space-y-2">
                              <div className="flex items-center justify-between mb-3 px-2">
                                <h4 className="text-sm text-[var(--color-stone)]">
                                  Registered Students ({classBookings.length})
                                </h4>
                                {onManualBooking && classItem.booked < classItem.capacity && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      onManualBooking(classItem.id, classItem.name, classItem.time);
                                    }}
                                    className="bg-[var(--color-sage)] hover:bg-[var(--color-clay)] text-white px-3 py-1.5 rounded-lg flex items-center gap-1.5 text-xs transition-all duration-200 shadow-sm hover:shadow-md"
                                  >
                                    <UserPlus size={14} />
                                    <span>Add Booking</span>
                                  </button>
                                )}
                              </div>
                              
                              {/* Student List */}
                              <div className="space-y-2">
                                {classBookings.map((booking) => (
                                  <div 
                                    key={booking.id}
                                    className="bg-white rounded-lg p-3 md:p-4 shadow-sm hover:shadow-md transition-shadow duration-200"
                                  >
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                                      {/* Avatar & Name */}
                                      <div className="flex items-center gap-3 flex-1 min-w-0">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--color-sage)] to-[var(--color-clay)] flex items-center justify-center text-white flex-shrink-0">
                                          {booking.avatar}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                          <div className="flex items-center gap-2 flex-wrap">
                                            <div className="text-sm md:text-base text-[var(--color-earth-dark)] truncate">
                                              {booking.name}
                                            </div>
                                            {booking.isGuest && (
                                              <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs rounded-full whitespace-nowrap">
                                                Guest
                                              </span>
                                            )}
                                          </div>
                                          <div className="text-xs text-[var(--color-stone)]">
                                            Booked: {booking.bookingTime}
                                          </div>
                                        </div>
                                      </div>

                                      {/* Contact Actions & Status */}
                                      <div className="flex items-center gap-3 sm:gap-4 flex-wrap sm:flex-nowrap">
                                        {/* Phone */}
                                        <a
                                          href={`tel:${booking.phone}`}
                                          className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 hover:bg-blue-100 transition-colors"
                                          title={`Call ${booking.phone}`}
                                        >
                                          <Phone size={16} className="text-blue-600" />
                                        </a>

                                        {/* Social Contact */}
                                        {booking.contactInfo ? (
                                          <a
                                            href={booking.contactInfo}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-green-50 hover:bg-green-100 transition-colors"
                                            title={`Contact via ${booking.contactPlatform}`}
                                          >
                                            {getContactIcon(booking.contactPlatform)}
                                          </a>
                                        ) : (
                                          <div
                                            className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-orange-50"
                                            title="No contact info available"
                                          >
                                            <AlertCircle size={16} className="text-orange-600" />
                                          </div>
                                        )}

                                        {/* Status Badge */}
                                        <div className="flex items-center gap-2">
                                          <span 
                                            className={`px-3 py-1 rounded-full text-xs whitespace-nowrap ${
                                              checkedInStudents.has(booking.id)
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-blue-100 text-blue-700'
                                            }`}
                                          >
                                            {checkedInStudents.has(booking.id) ? 'Checked-in' : 'Confirmed'}
                                          </span>
                                        </div>

                                        {/* Check-in Button */}
                                        <button
                                          onClick={() => handleCheckIn(booking.id)}
                                          className={`px-3 py-1.5 rounded-lg text-xs whitespace-nowrap transition-all duration-200 flex items-center gap-1.5 ${
                                            checkedInStudents.has(booking.id)
                                              ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                              : 'bg-[var(--color-sage)] text-white hover:bg-[var(--color-clay)] shadow-sm hover:shadow-md'
                                          }`}
                                        >
                                          <UserCheck size={14} />
                                          {checkedInStudents.has(booking.id) ? 'Undo' : 'Check-in'}
                                        </button>

                                        {/* Mark as Paid Button */}
                                        {booking.isGuest && booking.paymentStatus === 'unpaid' && (
                                          <button
                                            onClick={() => onMarkAsPaid?.(booking.id, classItem.id, classItem.name, booking.paymentAmount || 0)}
                                            className="px-3 py-1.5 rounded-lg text-xs whitespace-nowrap transition-all duration-200 flex items-center gap-1.5 bg-[var(--color-sage)] text-white hover:bg-[var(--color-clay)] shadow-sm hover:shadow-md"
                                          >
                                            <DollarSign size={14} />
                                            Mark as Paid
                                          </button>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}