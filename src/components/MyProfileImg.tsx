import React from "react";
import ImageUploading, { ImageListType } from "react-images-uploading";
import { request } from "../config/axios";

export function MyProfileImg() {
  const [images, setImages] = React.useState([]);
  const [url, setUrl] = React.useState("");
  const maxNumber = 69;

  const onChange = (
    imageList: ImageListType,
    addUpdateIndex: number[] | undefined
  ) => {
    // data for submit
    console.log(imageList, addUpdateIndex);
    setImages(imageList as never[]);
  };

  const onImageServerUpload = async (imageList: ImageListType) => {
    console.log(imageList);
    console.log("서버에 보냅니다.");
    const formData = new FormData();
    if (imageList == undefined || imageList[0].file == undefined) {
      return;
    }
    formData.append("file", imageList[0].file);
    await request
      .post("/images", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        console.log(res.data);
        setUrl(res.data);
      });
  };

  return (
    <div className="App">
      <ImageUploading
        multiple
        value={images}
        onChange={onChange}
        maxNumber={maxNumber}
      >
        {({
          imageList,
          onImageUpload,
          onImageRemoveAll,
          onImageUpdate,
          onImageRemove,
          isDragging,
          dragProps,
        }) => (
          // write your building UI
          <div className="upload__image-wrapper">
            <button
              style={isDragging ? { color: "red" } : undefined}
              onClick={onImageUpload}
              {...dragProps}
            >
              Click or Drop here
            </button>
            &nbsp;
            <button onClick={onImageRemoveAll}>Remove all images</button>
            {imageList.map((image, index) => (
              <div key={index} className="image-item">
                <img src={image.dataURL} alt="" width="100" />
                <div className="image-item__btn-wrapper">
                  <button onClick={() => onImageUpdate(index)}>Update</button>
                  <button onClick={() => onImageRemove(index)}>Remove</button>
                </div>
              </div>
            ))}
            <button onClick={() => onImageServerUpload(imageList)}>
              Server Upload
            </button>
          </div>
        )}
      </ImageUploading>

      {url && (
        <div>
          서버에서 받은 이미지
          <img
            alt="서버에서 받은 이미지입니다"
            src={url}
            style={{ width: "100px", height: "100px" }}
          />
        </div>
      )}
    </div>
  );
}
