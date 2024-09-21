import { useState } from "react";
import { Route, Switch, useRoute } from "wouter";
import rawData from "./campgrounds.json";
import fireData from "./ftp_data.json";
import "./App.css";

console.log(rawData);
const users = rawData;

var HomePage = () => {
	// --- PAGE LOAD ---
	const [searchItem, setSearchItem] = useState("");
	const [filteredUsers, setFilteredUsers] = useState(users);

	const handleInputChange = (e) => {
		const searchTerm = e.target.value;
		setSearchItem(searchTerm);

		const filteredItems = users.filter((user) =>
			user.name.toLowerCase().includes(searchTerm.toLowerCase())
		);

		setFilteredUsers(filteredItems);
	};

	return (
		<>
			<h1 className="logo">FireDanger</h1>
			<p className="subtitle">
				FireDanger is a home-made app with the strict purpose of displaying the fire danger
				index and whether or not you can have a campfire in todays conditions
			</p>
			{/* <p>
				⚠️ Please check with local authorities before lighting fires due to the summer fire ban
				from Dec 1 to March 31 ⚠️
			</p> */}
			<>
				<input
					type="search"
					value={searchItem}
					onChange={handleInputChange}
					placeholder="Type to search"
				/>
				<ul>
					{filteredUsers.map((user) => (
						<li key={user.id}>
							<a href={user.name}>{user.name}</a>
						</li>
					))}
				</ul>
			</>
		</>
	);
};

var CampgroundPage = () => {
	var [, params] = useRoute("/:name");
	// campgroundName
	// let makeSpace = params.name.replace(/-/g, " ");
	let makeSpace = params.name.replaceAll("%20", " ");
	let campgroundName = makeSpace.replaceAll("%E2%80%93", " - ");

	// solution to find the values in json came from this stackoverflow piece: https://stackoverflow.com/questions/19253753/javascript-find-json-value
	for (var x = 0; x < rawData.length; x++) {
		if (rawData[x].name === campgroundName) {
			console.log(campgroundName + " Found");
			console.log(fireData[x]);

			console.log(rawData[x]["district-id"]);
			let f = rawData[x]["district-id"];

			var site = fireData[f];
			var danger = site.danger;
			var dangerIndex = site.fdi;
			console.log(site);
			console.log(site.danger);
		}
	}

	// if (x >= rawData.length) {
	// 	console.log("poop");
	// 	window.location.replace("/");
	// }

	// TODO: Use a switch statement instead of elseif's
	if (dangerIndex < 12) {
		var campfiresPermitted = "✅";
		// leave danger colour blank to keep text colour black
		var dangerMeaning =
			"The Fire Danger Index (FDI) is below 12 which means that the risk of fire is low.";
	} else if (dangerIndex < 23) {
		var campfiresPermitted = "✅";
		var dangerMeaning = "Stay up to date and be ready to act if there is a fire.";
	} else if (dangerIndex < 49) {
		var campfiresPermitted = "🚫";
		var dangerMeaning =
			"There's a heightened risk. Be alert for fires in your area. Decide what you will do if a fire starts. If a fire starts, your life and property may be at risk. The safest option is to avoid bush fire risk areas.";
	} else if (dangerIndex < 99) {
		var campfiresPermitted = "🚫🚫";
		var dangerMeaning =
			"These are dangerous fire conditions. \n Check your bush fire plan and ensure that your property is fire ready. \n If a fire starts, take immediate action. If you and your property are not prepared to the highest level, go to a safer location well before the fire impacts. \n Reconsider travel through bush fire risk areas.";
	} else {
		var campfiresPermitted = "🚫🚫🚫";
		var dangerMeaning =
			"These are the most dangerous conditions for a fire. \n  \n Your life may depend on the decisions you make, even before there is a fire. \n \n Stay safe by going to a safer location early in the morning or the night before. \n \n Homes cannot withstand fires in these conditions. \n \n You may not be able to leave, and help may not be available.";
	}

	return (
		<>
			<h1>{campgroundName}</h1>
			<div>
				<h2 className={danger}>{danger}</h2>
				<p>Campfire Status: {campfiresPermitted}</p>
			</div>

			<p>{dangerMeaning}</p>
			<div className="checkAnotherDiv">
				<a href="/" className="check-another">
					Check another location
				</a>
			</div>
		</>
	);
};

var NotFound = () => {
	return (
		<>
			<h1>Uh oh</h1>
			<p>Something went wrong and I couldn't find the page you're looking for.</p>
			<div className="checkAnotherDiv">
				<a href="/" className="check-another">
					Back to the Homepage
				</a>
			</div>
		</>
	);
};

export default function App() {
	return (
		<div>
			<Switch>
				<Route path="/" component={HomePage}></Route>
				<Route path="/:name" component={CampgroundPage}></Route>
				<Route path="/:rest*" component={NotFound}></Route>
			</Switch>
		</div>
	);
}
