interface FiltersProps {
  selectedDomain: string;
  onDomainChange: (domain: string) => void;
  selectedStatus: string;
  onStatusChange: (status: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
}

const domains = [
  'All',
  'Web Development',
  'AI/ML',
  'App Development',
  'Blockchain',
  'IoT',
  'Game Development',
  'Data Science',
  'Cybersecurity',
];

const statuses = ['All', 'Open', 'In Progress', 'Near Completion', 'Completed'];

const sortOptions = [
  { value: 'newest', label: 'Newest' },
  { value: 'progress', label: 'Progress' },
  { value: 'popularity', label: 'Popularity' },
];

export default function Filters({
  selectedDomain,
  onDomainChange,
  selectedStatus,
  onStatusChange,
  sortBy,
  onSortChange,
}: FiltersProps) {
  return (
    <div className="flex flex-wrap gap-4 items-center">
      <div>
        <label className="block text-sm font-medium text-gray-400 mb-2">
          Domain
        </label>
        <select
          value={selectedDomain}
          onChange={(e) => onDomainChange(e.target.value)}
          className="px-4 py-2 bg-gray-900 border border-gray-800 rounded-lg text-white focus:outline-none focus:border-blue-500"
        >
          {domains.map((domain) => (
            <option key={domain} value={domain}>
              {domain}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-400 mb-2">
          Status
        </label>
        <select
          value={selectedStatus}
          onChange={(e) => onStatusChange(e.target.value)}
          className="px-4 py-2 bg-gray-900 border border-gray-800 rounded-lg text-white focus:outline-none focus:border-blue-500"
        >
          {statuses.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-400 mb-2">
          Sort By
        </label>
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="px-4 py-2 bg-gray-900 border border-gray-800 rounded-lg text-white focus:outline-none focus:border-blue-500"
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
