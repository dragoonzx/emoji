import React from "react";
import Webcam from "react-webcam";
import okImg from "../img/ok.png";
import { div } from "@tensorflow/tfjs-core";

const videoConstraints = {
  width: 500,
  height: 500,
  facingMode: "user"
};

const WebcamCapture = props => {
  const webcamRef = React.useRef(null);
  let intervalRef = React.useRef(null);
  const funcForInterval = () => {
    if (!webcamRef.current) return null;
    const imageSrc = webcamRef.current.getScreenshot();
    props.handleUpload(imageSrc);
  };
  React.useEffect(() => {
    window.addEventListener("keypress", () => {
      const imageSrc = webcamRef.current.getScreenshot();
      props.handleUpload(imageSrc);
    });
    funcForInterval();
    // setTimeout(() => (intervalRef = setInterval(funcForInterval, 1200)), 10000);
  }, []);
  if (props.stopRecognition) {
    clearInterval(intervalRef);
    return (
      <div>
        <svg
          enable-background="new 0 0 96 96"
          height="96px"
          version="1.1"
          viewBox="0 0 96 96"
          width="96px"
          xmlSpace="preserve"
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          fill="#59b759"
        >
          <path d="M48,4C23.7,4,4,23.699,4,48s19.7,44,44,44s44-19.699,44-44S72.3,4,48,4z M48,84c-19.882,0-36-16.118-36-36s16.118-36,36-36  s36,16.118,36,36S67.882,84,48,84z" />
          <path d="M64.284,37.17c-1.562-1.561-4.095-1.561-5.657,0L44.485,51.313l-5.657-5.657c-1.562-1.562-4.094-1.562-5.657,0  c-1.562,1.562-1.562,4.095,0,5.658l8.484,8.483c1.562,1.562,4.096,1.562,5.658,0l16.97-16.97  C65.846,41.265,65.848,38.733,64.284,37.17z" />
        </svg>
      </div>
    );
  }

  return (
    <React.Fragment>
      <Webcam
        audio={false}
        height={500}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        width={500}
        videoConstraints={videoConstraints}
      />
    </React.Fragment>
  );
};

export default WebcamCapture;
