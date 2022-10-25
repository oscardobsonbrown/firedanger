import { useState } from "react";
import { Route, Switch, useRoute } from "wouter";
import data from "./campgrounds.json";
import fireData from "./ftp_data.json";
import "./App.css";

const HomePage = () => {
	// const campgrounds = ["Honeymoon Pool", "Nanga Mill", "Drummonds", "Bald Hill"];
	const campgroundUrlName = [];

	// create a list of campgrounds from the JSON file
	var campgroundsLen = data.length;
	var campgrounds = [];
	for (var c = 0; c < campgroundsLen; c++) {
		// console.log(data[c].name);
		campgrounds.push(data[c].name);
	}
	console.log(campgrounds);

	// console.log(campgroundsLen);

	// create the list of campground URL's by going though the campgrounds array above and inserting a hyphen wherever there's a space
	var arrayLen = campgrounds.length;
	for (var i = 0; i < arrayLen; i++) {
		// get the value before adding hyphen
		// console.log(campgrounds[i]);
		// add the hyphen
		const newName = campgrounds[i].replace(/\s+/g, "-");
		// get the value after adding the hyphen
		// console.log(newName);
		// add the value to the array of matching URLs
		campgroundUrlName.push(newName);
		// check that the array is working as intended
		// console.log(campgroundUrlName);
	}

	const [filteredList, setFilteredList] = new useState(campgrounds);
	const filterBySearch = (event) => {
		// Access input value
		const query = event.target.value;
		// Create copy of item list
		var updatedCampgrounds = [...campgrounds];
		// Include all elements which includes the search query
		updatedCampgrounds = updatedCampgrounds.filter((campground) => {
			return campground.toLowerCase().indexOf(query.toLowerCase()) !== -1;
		});
		// Trigger render with updated values
		setFilteredList(updatedCampgrounds);
	};

	return (
		<>
			<h1 className="logo">FireDanger</h1>
			<p>
				FireDanger is a home made app inspired by the difficulty of figuring out if I can have a
				campfire at a campsite and the difficulties of finding that information.
			</p>
			<div className="search-header">
				<div className="search-text">Search for a Campsite:</div>
				<input id="search-box" onChange={filterBySearch} type="search" />
			</div>
			<div id="campground-list">
				<ul>
					{filteredList.map((campground, i) => (
						<li key={i}>
							<a href={campgroundUrlName[i]}>{campground}</a>
						</li>
					))}
				</ul>
			</div>
		</>
	);
};

const CampgroundPage = () => {
	const [, params] = useRoute("/:name");
	// campgroundName
	let makeSpace = params.name.replace(/-/g, " ");
	let campgroundName = makeSpace.replace("%E2%80%93", "–");

	// solution to find the values in json came from this stackoverflow piece: https://stackoverflow.com/questions/19253753/javascript-find-json-value
	for (var x = 0; x < data.length; x++) {
		if (data[x].name === campgroundName) {
			console.log(campgroundName + " Found");
			console.log(fireData[x]);

			console.log(data[x]["district-id"]);
			let f = data[x]["district-id"];

			var site = fireData[f];
			var danger = site.danger;
			var dangerIndex = site.fdi;
			console.log(site);
			console.log(site.danger);
		}
	}

	// if (x >= data.length) {
	// 	console.log("poop");
	// 	window.location.replace("/");
	// }

	if (dangerIndex < 12) {
		var campfiresPermitted = "true";
		// leave danger colour blank to keep text colour black
		var dangerMeaning =
			"The Fire Danger Index (FDI) is below 12 which means that the risk of fire is low.";
	} else if (dangerIndex < 23) {
		var campfiresPermitted = "true";
		var dangerMeaning = "Stay up to date and be ready to act if there is a fire.";
	} else if (dangerIndex < 49) {
		var campfiresPermitted = "false";
		var dangerMeaning =
			"There's a heightened risk. Be alert for fires in your area. Decide what you will do if a fire starts. If a fire starts, your life and property may be at risk. The safest option is to avoid bush fire risk areas.";
	} else if (dangerIndex < 99) {
		var campfiresPermitted = "false";
		var dangerMeaning =
			"These are dangerous fire conditions. \n Check your bush fire plan and ensure that your property is fire ready. \n If a fire starts, take immediate action. If you and your property are not prepared to the highest level, go to a safer location well before the fire impacts. \n Reconsider travel through bush fire risk areas.";
	} else {
		var campfiresPermitted = "false";
		var dangerMeaning =
			"These are the most dangerous conditions for a fire. \n  \n Your life may depend on the decisions you make, even before there is a fire. \n \n Stay safe by going to a safer location early in the morning or the night before. \n \n Homes cannot withstand fires in these conditions. \n \n You may not be able to leave, and help may not be available.";
	}

	return (
		<>
			<h1>{campgroundName}</h1>
			<div>
				<h2 className={danger}>{danger}</h2>
				<p>Campfired Permitted: {campfiresPermitted}</p>
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

const NotFound = () => {
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
