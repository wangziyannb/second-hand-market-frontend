import React, {useState} from "react";
import {Input} from "antd";


const {Search} = Input;

function SearchBar(props) {
    const [error, setError] = useState("");


    const handleSearch = (value) => {
        if (value === "") {
            setError("Please input your search keyword!");
            return;
        }
        setError("");
        props.handleSearch({keyword: value});
    };

    return (
        <div className="search-bar">
            <Search
                placeholder="Need Something?"
                enterButton="Search"
                size="large"
                onSearch={handleSearch}
            />
            <p className="error-msg">{error}</p>
        </div>
    );
}

export default SearchBar;
