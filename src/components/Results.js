import React from "react";
import { format } from "d3-format";

import Message from "./Message";

const fmt = (x, digits = 1) => format(`.${digits}%`)(x);

const Results = ({ faces, emotions, stopRecognition }) => {
	const [sended, setSended] = React.useState(false);
	if (stopRecognition) {
		// const url_string = window.location.href; //window.location.href
		// const url = new URL(url_string);
		// const id = url.searchParams.get("id");
		// fetch(
		// 	// `https://digitalnation.ru/request/create?id=${2}&image1=${"1231"}&image2=${"23"}&image3=${"23"}`

		// 	`https://digitalnation.ru/request/create?id=${id}&image1=${faces[0].toDataURL()}&image2=${faces[1].toDataURL()}&image3=${faces[2].toDataURL()}`
		// );
		setTimeout(() => {
			window.location = "https://vk.com";
		}, 3000);
	}
	return (
		<div>
			<div className="flex flex-wrap mxn1 mt1">
				{faces.map((face, i) => (
					<div key={i} className="col col-4 sm-col-3 md-col-5th px1">
						<div className="mb1 border border-silver rounded overflow-hidden">
							<img
								src={face.toDataURL()}
								alt={`face ${i + 1}`}
								className="block col-12"
							/>
							<div className="p05 fs-tiny">
								{emotions[i].slice(0, 2).map(({ label, value }) => (
									<div key={label.name} className="flex justify-between">
										<div className="mr05 truncate">
											{label.emoji}
											{label.name}
										</div>
										<div className="bold">{fmt(value)}</div>
									</div>
								))}
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default Results;
