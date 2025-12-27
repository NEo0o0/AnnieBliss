import { useState, useMemo } from 'react';
import { Search, MoreVertical, UserPlus, Calendar, Package, TrendingUp, Users as UsersIcon, X, MessageCircle, Instagram, Facebook, ExternalLink } from 'lucide-react';

interface Member {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  contactInfo?: string; // Full clickable URL
  contactPlatform?: 'line' | 'instagram' | 'facebook' | 'whatsapp';
  avatar?: string;
  packageType: 'unlimited' | 'class-pack' | 'drop-in' | null;
  packageName: string;
  creditsLeft?: number;
  totalCredits?: number;
  expiryDate?: string;
  status: 'active' | 'inactive';
  joinedDate: string;
  nationality?: string;
}

const mockMembers: Member[] = [
  {
    id: '1',
    fullName: 'Sarah Thompson',
    email: 'sarah.thompson@email.com',
    phone: '+66 81 234 5678',
    contactInfo: 'https://line.me/ti/p/@sarah_yoga',
    contactPlatform: 'line',
    packageType: 'unlimited',
    packageName: 'Unlimited Monthly',
    expiryDate: '2026-01-24',
    status: 'active',
    joinedDate: '2024-11-15',
    nationality: 'American'
  },
  {
    id: '2',
    fullName: 'Michael Chen',
    email: 'michael.chen@email.com',
    phone: '+66 82 345 6789',
    contactInfo: 'https://line.me/ti/p/@michael_chen',
    contactPlatform: 'line',
    packageType: 'class-pack',
    packageName: '10-Class Pack',
    creditsLeft: 7,
    totalCredits: 10,
    status: 'active',
    joinedDate: '2024-12-01',
    nationality: 'Chinese'
  },
  {
    id: '3',
    fullName: 'Emma Rodriguez',
    email: 'emma.r@email.com',
    phone: '+66 83 456 7890',
    contactInfo: 'https://line.me/ti/p/@emma_rodriguez',
    contactPlatform: 'line',
    packageType: 'class-pack',
    packageName: '20-Class Pack',
    creditsLeft: 15,
    totalCredits: 20,
    status: 'active',
    joinedDate: '2024-10-20',
    nationality: 'Spanish'
  },
  {
    id: '4',
    fullName: 'David Kim',
    email: 'david.kim@email.com',
    phone: '+66 84 567 8901',
    contactInfo: 'https://line.me/ti/p/@david_kim_yoga',
    contactPlatform: 'line',
    packageType: 'unlimited',
    packageName: 'Unlimited Monthly',
    expiryDate: '2026-01-10',
    status: 'active',
    joinedDate: '2024-09-05',
    nationality: 'Korean'
  },
  {
    id: '5',
    fullName: 'Jessica Lee',
    email: 'jessica.lee@email.com',
    phone: '+66 85 678 9012',
    contactInfo: 'https://line.me/ti/p/@jessica_lee',
    contactPlatform: 'line',
    packageType: 'drop-in',
    packageName: 'Drop-in',
    status: 'active',
    joinedDate: '2024-12-15',
    nationality: 'American'
  },
  {
    id: '6',
    fullName: 'Robert Martinez',
    email: 'robert.m@email.com',
    phone: '+66 86 789 0123',
    contactInfo: 'https://line.me/ti/p/@robert_martinez',
    contactPlatform: 'line',
    packageType: 'class-pack',
    packageName: '5-Class Pack',
    creditsLeft: 2,
    totalCredits: 5,
    status: 'active',
    joinedDate: '2024-12-10',
    nationality: 'Spanish'
  },
  {
    id: '7',
    fullName: 'Amanda Wilson',
    email: 'amanda.wilson@email.com',
    phone: '+66 87 890 1234',
    packageType: 'unlimited',
    packageName: 'Unlimited Monthly',
    expiryDate: '2025-12-15',
    status: 'inactive',
    joinedDate: '2024-08-12',
    nationality: 'Australian'
  },
  {
    id: '8',
    fullName: 'Kevin Patel',
    email: 'kevin.patel@email.com',
    phone: '+66 88 901 2345',
    contactInfo: 'https://line.me/ti/p/@kevin_patel',
    contactPlatform: 'line',
    packageType: 'class-pack',
    packageName: '10-Class Pack',
    creditsLeft: 0,
    totalCredits: 10,
    status: 'inactive',
    joinedDate: '2024-11-01',
    nationality: 'Indian'
  },
  {
    id: '9',
    fullName: 'Lisa Anderson',
    email: 'lisa.anderson@email.com',
    phone: '+66 89 012 3456',
    contactInfo: 'https://line.me/ti/p/@lisa_anderson',
    contactPlatform: 'line',
    packageType: 'unlimited',
    packageName: 'Unlimited Yearly',
    expiryDate: '2026-06-30',
    status: 'active',
    joinedDate: '2024-07-15',
    nationality: 'American'
  },
  {
    id: '10',
    fullName: 'James Taylor',
    email: 'james.taylor@email.com',
    phone: '+66 90 123 4567',
    contactInfo: 'https://line.me/ti/p/@james_taylor',
    contactPlatform: 'line',
    packageType: 'drop-in',
    packageName: 'Drop-in',
    status: 'active',
    joinedDate: '2024-12-20',
    nationality: 'British'
  }
];

type FilterType = 'all' | 'unlimited' | 'class-pack' | 'drop-in';
type SortField = 'fullName' | 'joinedDate' | 'status';
type SortDirection = 'asc' | 'desc';

export function MembersManagement() {
  const [members] = useState<Member[]>(mockMembers);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [sortField, setSortField] = useState<SortField>('joinedDate');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // Filter and search members
  const filteredMembers = useMemo(() => {
    let result = [...members];

    // Apply filter
    if (activeFilter !== 'all') {
      result = result.filter(member => member.packageType === activeFilter);
    }

    // Apply search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(member =>
        member.fullName.toLowerCase().includes(query) ||
        member.phone.toLowerCase().includes(query) ||
        member.email.toLowerCase().includes(query)
      );
    }

    // Apply sorting
    result.sort((a, b) => {
      let comparison = 0;

      if (sortField === 'fullName') {
        comparison = a.fullName.localeCompare(b.fullName);
      } else if (sortField === 'joinedDate') {
        comparison = new Date(a.joinedDate).getTime() - new Date(b.joinedDate).getTime();
      } else if (sortField === 'status') {
        comparison = a.status.localeCompare(b.status);
      }

      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [members, activeFilter, searchQuery, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getCreditsPercentage = (creditsLeft: number, totalCredits: number) => {
    return (creditsLeft / totalCredits) * 100;
  };

  const getCreditsColor = (percentage: number) => {
    if (percentage >= 50) return 'bg-green-500';
    if (percentage >= 25) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const isExpired = (expiryDate: string) => {
    return new Date(expiryDate) < new Date();
  };

  const getContactIcon = (platform?: 'line' | 'instagram' | 'facebook' | 'whatsapp') => {
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

  const filterCounts = {
    all: members.length,
    unlimited: members.filter(m => m.packageType === 'unlimited').length,
    'class-pack': members.filter(m => m.packageType === 'class-pack').length,
    'drop-in': members.filter(m => m.packageType === 'drop-in').length,
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl text-[var(--color-earth-dark)] mb-2">Members</h1>
            <p className="text-[var(--color-stone)]">Manage your yoga studio members and packages</p>
          </div>
          <button className="bg-[var(--color-sage)] hover:bg-[var(--color-clay)] text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-all duration-300 shadow-md hover:shadow-lg">
            <UserPlus size={20} />
            <span>Add New Member</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-md">
          <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-stone)]" />
          <input
            type="text"
            placeholder="Search by name, phone, or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-lg border border-[var(--color-sand)] focus:ring-2 focus:ring-[var(--color-sage)] focus:border-transparent transition-all duration-300"
          />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg p-6 shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[var(--color-stone)] mb-1">Total Members</p>
              <p className="text-3xl text-[var(--color-earth-dark)]">{filterCounts.all}</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
              <UsersIcon size={24} className="text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[var(--color-stone)] mb-1">Unlimited</p>
              <p className="text-3xl text-[var(--color-earth-dark)]">{filterCounts.unlimited}</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
              <TrendingUp size={24} className="text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[var(--color-stone)] mb-1">Class Packs</p>
              <p className="text-3xl text-[var(--color-earth-dark)]">{filterCounts['class-pack']}</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
              <Package size={24} className="text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[var(--color-stone)] mb-1">Drop-ins</p>
              <p className="text-3xl text-[var(--color-earth-dark)]">{filterCounts['drop-in']}</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center">
              <Calendar size={24} className="text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="mb-6 border-b border-[var(--color-sand)]">
        <div className="flex gap-4">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-4 py-3 border-b-2 transition-all duration-300 ${
              activeFilter === 'all'
                ? 'border-[var(--color-sage)] text-[var(--color-sage)]'
                : 'border-transparent text-[var(--color-stone)] hover:text-[var(--color-earth-dark)]'
            }`}
          >
            All Members ({filterCounts.all})
          </button>
          <button
            onClick={() => setActiveFilter('unlimited')}
            className={`px-4 py-3 border-b-2 transition-all duration-300 ${
              activeFilter === 'unlimited'
                ? 'border-[var(--color-sage)] text-[var(--color-sage)]'
                : 'border-transparent text-[var(--color-stone)] hover:text-[var(--color-earth-dark)]'
            }`}
          >
            Unlimited Users ({filterCounts.unlimited})
          </button>
          <button
            onClick={() => setActiveFilter('class-pack')}
            className={`px-4 py-3 border-b-2 transition-all duration-300 ${
              activeFilter === 'class-pack'
                ? 'border-[var(--color-sage)] text-[var(--color-sage)]'
                : 'border-transparent text-[var(--color-stone)] hover:text-[var(--color-earth-dark)]'
            }`}
          >
            Class Pack Users ({filterCounts['class-pack']})
          </button>
          <button
            onClick={() => setActiveFilter('drop-in')}
            className={`px-4 py-3 border-b-2 transition-all duration-300 ${
              activeFilter === 'drop-in'
                ? 'border-[var(--color-sage)] text-[var(--color-sage)]'
                : 'border-transparent text-[var(--color-stone)] hover:text-[var(--color-earth-dark)]'
            }`}
          >
            Drop-in Users ({filterCounts['drop-in']})
          </button>
        </div>
      </div>

      {/* Members Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[var(--color-cream)]">
              <tr>
                <th 
                  className="px-6 py-4 text-left text-xs uppercase tracking-wider text-[var(--color-stone)] cursor-pointer hover:bg-[var(--color-sand)] transition-colors"
                  onClick={() => handleSort('fullName')}
                >
                  <div className="flex items-center gap-2">
                    Member
                    {sortField === 'fullName' && (
                      <span className="text-[var(--color-sage)]">
                        {sortDirection === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-xs uppercase tracking-wider text-[var(--color-stone)]">
                  Current Package
                </th>
                <th className="px-6 py-4 text-left text-xs uppercase tracking-wider text-[var(--color-stone)]">
                  Status / Credits
                </th>
                <th 
                  className="px-6 py-4 text-left text-xs uppercase tracking-wider text-[var(--color-stone)] cursor-pointer hover:bg-[var(--color-sand)] transition-colors"
                  onClick={() => handleSort('status')}
                >
                  <div className="flex items-center gap-2">
                    Status
                    {sortField === 'status' && (
                      <span className="text-[var(--color-sage)]">
                        {sortDirection === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
                <th 
                  className="px-6 py-4 text-left text-xs uppercase tracking-wider text-[var(--color-stone)] cursor-pointer hover:bg-[var(--color-sand)] transition-colors"
                  onClick={() => handleSort('joinedDate')}
                >
                  <div className="flex items-center gap-2">
                    Joined Date
                    {sortField === 'joinedDate' && (
                      <span className="text-[var(--color-sage)]">
                        {sortDirection === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-xs uppercase tracking-wider text-[var(--color-stone)]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-sand)]">
              {filteredMembers.map((member) => (
                <tr key={member.id} className="hover:bg-[var(--color-cream)]/50 transition-colors duration-150">
                  {/* Member Info */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--color-sage)] to-[var(--color-clay)] flex items-center justify-center text-white text-sm">
                        {getInitials(member.fullName)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[var(--color-earth-dark)]">{member.fullName}</span>
                          {member.contactInfo && member.contactPlatform && (
                            <a
                              href={member.contactInfo}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center justify-center w-6 h-6 rounded-full hover:bg-[var(--color-cream)] transition-all duration-200 group"
                              title={`Contact on ${member.contactPlatform}`}
                            >
                              {getContactIcon(member.contactPlatform)}
                            </a>
                          )}
                        </div>
                        <div className="text-xs text-[var(--color-stone)]">{member.phone}</div>
                        <div className="text-xs text-[var(--color-stone)]">{member.email}</div>
                      </div>
                    </div>
                  </td>

                  {/* Current Package */}
                  <td className="px-6 py-4">
                    <div className="text-sm text-[var(--color-earth-dark)]">{member.packageName}</div>
                  </td>

                  {/* Status / Credits */}
                  <td className="px-6 py-4">
                    {member.packageType === 'class-pack' && member.creditsLeft !== undefined && member.totalCredits !== undefined ? (
                      <div>
                        <div className="text-sm text-[var(--color-earth-dark)] mb-1">
                          {member.creditsLeft} of {member.totalCredits} credits left
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all duration-300 ${getCreditsColor(getCreditsPercentage(member.creditsLeft, member.totalCredits))}`}
                            style={{ width: `${getCreditsPercentage(member.creditsLeft, member.totalCredits)}%` }}
                          />
                        </div>
                      </div>
                    ) : member.packageType === 'unlimited' && member.expiryDate ? (
                      <div className="text-sm">
                        <div className="text-[var(--color-stone)]">Expires on</div>
                        <div className={`${isExpired(member.expiryDate) ? 'text-red-600' : 'text-[var(--color-earth-dark)]'}`}>
                          {formatDate(member.expiryDate)}
                        </div>
                      </div>
                    ) : (
                      <div className="text-sm text-[var(--color-stone)]">Pay per class</div>
                    )}
                  </td>

                  {/* Status Badge */}
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs ${
                      member.status === 'active' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {member.status === 'active' ? 'Active' : 'Inactive'}
                    </span>
                  </td>

                  {/* Joined Date */}
                  <td className="px-6 py-4">
                    <div className="text-sm text-[var(--color-stone)]">{formatDate(member.joinedDate)}</div>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 relative">
                    <button
                      onClick={() => setActiveMenuId(activeMenuId === member.id ? null : member.id)}
                      className="p-2 hover:bg-[var(--color-cream)] rounded-lg transition-colors duration-300"
                    >
                      <MoreVertical size={18} className="text-[var(--color-stone)]" />
                    </button>

                    {/* Dropdown Menu */}
                    {activeMenuId === member.id && (
                      <>
                        <div 
                          className="fixed inset-0 z-10" 
                          onClick={() => setActiveMenuId(null)}
                        />
                        <div className="absolute right-8 top-12 bg-white rounded-lg shadow-xl border border-[var(--color-sand)] py-2 z-20 min-w-[180px]">
                          <button className="w-full px-4 py-2 text-left text-sm text-[var(--color-earth-dark)] hover:bg-[var(--color-cream)] transition-colors">
                            View Details
                          </button>
                          <button className="w-full px-4 py-2 text-left text-sm text-[var(--color-earth-dark)] hover:bg-[var(--color-cream)] transition-colors">
                            Edit Profile
                          </button>
                          <button className="w-full px-4 py-2 text-left text-sm text-[var(--color-earth-dark)] hover:bg-[var(--color-cream)] transition-colors">
                            Assign Package
                          </button>
                          <div className="border-t border-[var(--color-sand)] my-2" />
                          <button className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors">
                            Deactivate Member
                          </button>
                        </div>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredMembers.length === 0 && (
          <div className="p-12 text-center">
            <div className="w-24 h-24 rounded-full bg-[var(--color-cream)] mx-auto mb-4 flex items-center justify-center">
              <UsersIcon size={40} className="text-[var(--color-sage)]" />
            </div>
            <h3 className="text-xl text-[var(--color-earth-dark)] mb-2">No members found</h3>
            <p className="text-[var(--color-stone)]">
              {searchQuery ? 'Try adjusting your search or filters' : 'Start by adding your first member'}
            </p>
          </div>
        )}

        {/* Results Count */}
        {filteredMembers.length > 0 && (
          <div className="px-6 py-4 border-t border-[var(--color-sand)] bg-[var(--color-cream)]/50">
            <p className="text-sm text-[var(--color-stone)]">
              Showing {filteredMembers.length} of {members.length} members
            </p>
          </div>
        )}
      </div>
    </div>
  );
}