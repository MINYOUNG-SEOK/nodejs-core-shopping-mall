import React, { Component } from "react";
import { Button } from "react-bootstrap";
import "../App.css";
import "../common/style/common.style.css";

const CLOUDNAME = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
const UPLOADPRESET = process.env.REACT_APP_CLOUDINARY_PRESET;

class CloudinaryUploadWidget extends Component {
  componentDidMount() {
    var myWidget = window.cloudinary.createUploadWidget(
      {
        cloudName: CLOUDNAME,
        uploadPreset: UPLOADPRESET,
      },
      (error, result) => {
        if (!error && result && result.event === "success") {
          console.log("Done! Here is the image info: ", result.info);
          // React 상태만 업데이트, DOM 직접 조작 제거
          this.props.uploadImage(result.info.secure_url);
        }
      } //https://cloudinary.com/documentation/react_image_and_video_upload
    );
    document.getElementById("upload_widget").addEventListener(
      "click",
      function () {
        myWidget.open();
      },
      false
    );
  }

  render() {
    return (
      <Button id="upload_widget" size="sm">
        Upload Image +
      </Button>
    );
  }
}

export default CloudinaryUploadWidget;
