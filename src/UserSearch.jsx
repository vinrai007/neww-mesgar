import React, { useState } from 'react';

const UserSearch = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (query) => {
    setSearchQuery(query);
    onSearch(query);
  };

  return (
    <div className=''>
      <input
        type="text"
        placeholder="Search users " 
        value={searchQuery}
        onChange={(e) => handleSearch(e.target.value)}
        className="p-2 ml-3 border rounded-sm mb- searchbar"
      />
    </div>
  );
};

export default UserSearch;
