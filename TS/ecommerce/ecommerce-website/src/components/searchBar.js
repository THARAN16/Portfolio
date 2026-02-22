function SearchBar(onSearch) {
    const searchBarContainer = document.createElement('div');
    searchBarContainer.className = 'search-bar';

    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'Search for items...';
    input.addEventListener('input', (event) => {
        onSearch(event.target.value);
    });

    searchBarContainer.appendChild(input);
    return searchBarContainer;
}

export default SearchBar;