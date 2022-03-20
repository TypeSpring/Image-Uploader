import React, { useCallback, useEffect } from "react";
import ImageUploading, { ImageListType } from "react-images-uploading";
import { request } from "../config/axios";

export function MyProfileImg() {
  const [images, setImages] = React.useState([]);
  const [url, setUrl] = React.useState("");
  const [bulkUrl, setBulkUrl] = React.useState([]);
  const maxNumber = 69;

  const onChange = (
    imageList: ImageListType,
    addUpdateIndex: number[] | undefined
  ) => {
    // data for submit
    console.log(imageList, addUpdateIndex);
    setImages(imageList as never[]);
  };

  //단건 이미지 업로드
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
        setBulkUrl(res.data);
      });
  };

  // bulk 이미지 업로드
  const onImageBulkServerUpload = async (imageList: ImageListType) => {
    console.log(imageList);
    console.log("서버에 보냅니다.");

    const formData = new FormData();
    if (imageList == undefined || imageList[0].file == undefined) {
      return;
    }
    imageList.map((it) => {
      if (it.file == undefined) {
        return;
      }
      formData.append("file", it.file);
    });
    await request
      .post("/images/bulk", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        console.log(res.data);
        setBulkUrl(bulkUrl.concat(res.data));
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
          <div className="upload__image-wrapper">
            <div className="upload__image-wrapper__btns">
              <button
                style={isDragging ? { color: "red" } : undefined}
                onClick={onImageUpload}
                {...dragProps}
              >
                Click or Drop here
              </button>
              &nbsp;
              <button onClick={onImageRemoveAll}>Remove all images</button>
            </div>
            {imageList.map((image, index) => (
              <div key={index} className="image-item">
                <img src={image.dataURL} alt="" width="100" />
                <div className="image-item__btn-wrapper">
                  <button onClick={() => onImageUpdate(index)}>Update</button>
                  <button onClick={() => onImageRemove(index)}>Remove</button>
                  {imageList[0] && (
                    <button onClick={() => onImageServerUpload(imageList)}>
                      단건 Server Upload
                    </button>
                  )}
                </div>
              </div>
            ))}
            {imageList[0] && (
              <button onClick={() => onImageBulkServerUpload(imageList)}>
                전체 Server Upload
              </button>
            )}
          </div>
        )}
      </ImageUploading>

      {url && (
        <div>
          서버에서 받은 이미지 (단건)
          <img
            alt="서버에서 받은 이미지입니다"
            src={url}
            style={{ width: "100px", height: "100px" }}
          />
        </div>
      )}

      {bulkUrl[0] && (
        <div>
          서버에서 받은 이미지 (Bulk)
          {console.log(bulkUrl)}
          {bulkUrl.map((it) => (
            <img
              alt="서버에서 받은 이미지입니다"
              key={it}
              src={it}
              style={{ width: "100px", height: "100px" }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
