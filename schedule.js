let intervalID = undefined;

/// Returns a total offset time in ms given the text of a table cell
const cellToTime = (cellText) => {
		const cellIsPM = cellText.substr(-2) == "PM",
			cellSplit = cellText.substr(0, cellText.length - 2).split(":"),
			hour = parseInt(cellSplit[0]),
			min = cellSplit.length > 1 ? parseInt(cellSplit[1]) : 0,
			totalHour = hour + (cellIsPM ? 12 : 0),
			totalMin = totalHour * 60 + min;
		return totalMin * 60 * 1000;
	},
	mainLoop = () => {
		//Make sure we have the time zone, otherwise phone time zones could be potentially wonky
		const dateOfEvent = new Date("2026.04.19 00:00:00 PDT"),
			dateCurrent = new Date(),
			//All offsets are in ms
			offsetCurrent = dateCurrent.getTime() - dateOfEvent.getTime(),
			rows = document
				.getElementById("schedule-table")
				.getElementsByTagName("tr");
		for (const row of rows) {
			row.classList.remove("live");
		}
		if (offsetCurrent < 0 || offsetCurrent > 24 * 60 * 60 * 1000) {
			//Today is not the day of the event
			clearInterval(intervalID);
			return;
		}
		for (const row of rows) {
			if (row.children[0].tagName.toUpperCase() != "TD") {
				//We are in the header
				continue;
			}
			const cellTextStart = row.children[0].innerText.trim(),
				cellTextEnd = row.children[1].innerText.trim(),
				offsetStart = cellToTime(cellTextStart),
				offsetEnd = cellToTime(cellTextEnd);
			if (offsetCurrent >= offsetStart && offsetCurrent < offsetEnd) {
				row.classList.add("live");
				break;
			}
		}
		// if(offset < 0 || offset > )
	};

intervalID = setInterval(mainLoop, 10000);
mainLoop();
