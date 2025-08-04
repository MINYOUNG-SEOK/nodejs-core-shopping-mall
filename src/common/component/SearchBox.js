import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { useSearchParams } from "react-router-dom";

const SearchBox = ({ searchQuery, setSearchQuery, placeholder, field }) => {
  const [query] = useSearchParams();
  const [keyword, setKeyword] = useState(query.get(field) || "");

  const onCheckEnter = (event) => {
    if (event.key === "Enter") {
      setSearchQuery({ ...searchQuery, page: 1, [field]: event.target.value });
    }
  };

  const handleSearch = () => {
    setSearchQuery({ ...searchQuery, page: 1, [field]: keyword });
  };
  return (
    <div className="search-box">
      <input
        type="text"
        placeholder={placeholder}
        onKeyPress={onCheckEnter}
        onChange={(event) => setKeyword(event.target.value)}
        value={keyword}
      />
      <FontAwesomeIcon
        icon={faSearch}
        onClick={handleSearch}
        className="search-icon-clickable"
      />
    </div>
  );
};

export default SearchBox;
