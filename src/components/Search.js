const SearchBar = ({ searchQuery, setSearchQuery }) => (
	<form action="/" method="get">
		<label htmlFor="search">
			<span className="visually-hidden">Search WA campgrounds</span>
		</label>
		<input
			value={searchQuery}
			onInput={(e) => setSearchQuery(e.target.value)}
			type="search"
			id="search"
			placeholder="Search WA campgrounds"
			name="s"
		/>
		<button type="submit">Search</button>
	</form>
);

export default SearchBar;
