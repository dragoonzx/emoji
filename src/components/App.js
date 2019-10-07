import debounce from "lodash.debounce";
import React, { Component } from "react";
import _ from "lodash";
import Dropzone from "react-dropzone";

import Footer from "./Footer";
import Header from "./Header";
import Message from "./Message";
import Results from "./Results";
import WebCam from "./WebCam";

import sampleImg from "../img/sample.jpg";
import { FaceFinder } from "../ml/face";
import { EmotionNet } from "../ml/models";
import { readFile, nextFrame, drawBox, drawText } from "../util";
//"😲", "😠",
const emojiList = ["😄", "😐", "🙁"];
const countRequiredEmoji = 3;

class App extends Component {
	constructor(props) {
		super(props);
		this.webcamRef = React.createRef();
	}
	state = {
		ready: false,
		loading: false,
		imgUrl: null,
		detections: [],
		faces: [],
		emotions: [],
		faceResults: [],
		requireEmotions: _.sampleSize(emojiList, countRequiredEmoji),
		stopRecognition: false,
		step: 0
	};

	componentDidMount() {
		window._ = _;
		this.initModels();
		window.addEventListener("resize", this.handleResize);
	}

	componentWillUnmount() {
		window.removeEventListener("resize", this.handleResize);
	}

	initModels = async () => {
		const faceModel = new FaceFinder();
		await faceModel.load();

		const emotionModel = new EmotionNet();
		await emotionModel.load();

		this.models = { face: faceModel, emotion: emotionModel };
		this.setState({ ready: true }, this.initPredict);
	};

	initPredict = () => {
		if (!this.img || !this.img.complete) return;
		this.setState({ loading: true });
		this.analyzeFaces();
	};

	handleImgLoaded = () => {
		this.clearCanvas();
		this.analyzeFaces();
	};

	handleResize = debounce(() => this.drawDetections(), 100);

	handleUpload = async file => {
		// if (!files.length) return;
		// const fileData = await readFile(files[0]);
		console.log(file);
		this.setState({
			imgUrl: file,
			loading: true
		});
	};

	analyzeFaces = async () => {
		await nextFrame();
		console.log("find model");
		if (!this.models) return;
		console.log("ANALYZE");
		// get face bounding boxes and canvases
		const faceResults = await this.models.face.findAndExtractFaces(this.img);
		let { detections, faces } = faceResults;
		this.state.faceResults.map(({ detections: detect, faces: face }) => {
			detections.push(...detect);
			faces.push(...face);
		});

		// get emotion predictions
		const emotions = {
			list: []
		};
		emotions.list = await Promise.all(
			faces.map(async face => await this.models.emotion.classify(face))
		);
		console.log(emotions.list);
		const firstEmoji = _.get(emotions, "list[0][0].label.emoji");
		console.log("here" + firstEmoji);
		// this.setState(prevState => ({ faces: [...this.state.faces, firstEmoji] }));
		// this.setState(prevState => ({
		// 	emotions: [...this.state.emotions, firstEmoji]
		// }));
		console.log(this.state.faces.length + ": num of faces");
		if (firstEmoji !== this.state.requireEmotions[this.state.step]) {
			return null;
		}
		this.setState(
			prevState => ({
				step: prevState.step + 1,
				faceResults: [...prevState.faceResults, faceResults],
				loading: false,
				detections,
				faces,
				emotions: emotions.list,
				stopRecognition: prevState.step + 1 >= countRequiredEmoji
			}),
			this.drawDetexctions
		);
	};

	clearCanvas = () => {
		this.canvas.width = 0;
		this.canvas.height = 0;
	};

	drawDetections = () => {
		const { detections, emotions } = this.state;
		if (!detections.length) return;

		const { width, height } = this.img;
		this.canvas.width = width;
		this.canvas.height = height;

		const ctx = this.canvas.getContext("2d");
		const detectionsResized = detections.map(d => d.forSize(width, height));

		detectionsResized.forEach((det, i) => {
			const { x, y } = det.box;
			const { emoji } = emotions[i][0].label;

			drawBox({ ctx, ...det.box });
			drawText({ ctx, x, y, text: emoji });
		});
	};

	render() {
		const { ready, imgUrl, loading, faces, emotions } = this.state;
		const noFaces = ready && !loading && imgUrl && !faces.length;
		return (
			<div className="px2 mx-auto container app">
				<Header requireEmotion={this.state.requireEmotions[this.state.step]} />
				<main>
					<div className="py1">
						{/* <Dropzone
              className="btn btn-small btn-primary btn-upload bg-black h5"
              accept="image/jpeg, image/png"
              multiple={false}
              disabled={!ready}
              onDrop={this.handleUpload}
            >
              Upload image
            </Dropzone> */}
						<WebCam
							stopRecognition={this.state.stopRecognition}
							handleUpload={this.handleUpload}
						/>
					</div>
					{imgUrl && (
						<div style={{ display: "none" }} className="relative">
							<img
								ref={el => (this.img = el)}
								onLoad={this.handleImgLoaded}
								src={imgUrl}
								alt=""
							/>
							<canvas
								ref={el => (this.canvas = el)}
								className="absolute top-0 left-0"
							/>
						</div>
					)}
					{!ready && <Message>Loading machine learning models...</Message>}
					{loading && <Message>Analyzing image...</Message>}
					{noFaces && (
						<Message bg="red" color="white">
							<strong>Sorry!</strong> No faces were detected. Please try another
							image.
						</Message>
					)}
					{faces.length > 0 && (
						<Results
							stopRecognition={this.state.stopRecognition}
							faces={faces}
							emotions={emotions}
						/>
					)}
				</main>
				<Footer />
			</div>
		);
	}
}

export default App;
