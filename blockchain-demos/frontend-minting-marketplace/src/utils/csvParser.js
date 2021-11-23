const csvParser = (data, resultReceiver, searchColumns, delimiter = ',') => {
	const reader = new FileReader();
	reader.onload = function (e) {
		const text = e.target.result.split(/\r\n|\n/)
		let headers = text.splice(0, 1)[0].split(delimiter);
		let getIndexes = Object.keys(headers).map(item => Number(item));
		if (searchColumns) {
			getIndexes = searchColumns.map(item => headers.indexOf(item));
		}
		let aux = [];
		text.forEach((textItem, textIndex) => {
			let split = textItem.split(delimiter);
			split = split.map(item => {
				return item.replace(/[\n\t\r]/g,"");
			});
			if ([',','.'].includes(delimiter)) {
				let offset = 0;
				let aux2 = [...split];
				aux2.forEach((item, index) => {
					if (item[0] === " ") {
						split[index - 1 - offset] += delimiter + item;
						offset++;
						split[index] = undefined;
					}
				});
				split = split.filter(item => item !== undefined);
			}
			if (split.length !== headers.length) {
				console.error('Error parsing line', textIndex, ', resulted in', split);
			}
			let result = {};

			getIndexes.forEach((item) => {
				result[headers[item]] = split[item];
			})
			aux.push(result)
		})
		resultReceiver(aux);
	};
	reader.readAsText(data);
}

export default csvParser;