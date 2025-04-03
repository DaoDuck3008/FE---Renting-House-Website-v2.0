import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useState } from "react";
import { faX, faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "react-bootstrap";

const Dropzone = ({ onFilesUploaded }) => {
  const [files, setFiles] = useState([]);
  const [rejected, setRejected] = useState([]);
  const [uploadStatus, setUploadStatus] = useState("");
  const [uploadNotice, setUploadNotice] = useState("");

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    // những ảnh đạt tiêu chí sẽ đi vào bước tiếp theo
    if (acceptedFiles?.length) {
      setFiles((previousFiles) => [
        ...previousFiles,
        ...acceptedFiles.map((file) =>
          Object.assign(file, { preview: URL.createObjectURL(file) })
        ),
      ]);
    }

    // những ảnh không đạt chỉ tiêu được lưu tạm thời vào 1 array
    if (rejectedFiles?.length) {
      setRejected((previousFiles) => [...previousFiles, ...rejectedFiles]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    maxSize: 1024 * 3000, // Ảnh có size tối đa là 3MB
  });

  const removeImg = (index) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles); // Cập nhật state của files
  };

  const handleSumbit = async (e) => {
    e.preventDefault();

    if (!files?.length) return;

    setUploadNotice("waiting");
    setUploadStatus("Waiting...");

    const URL = process.env.REACT_APP_CLOUDINARY_URL;

    try {
      // Sử dụng Promise.all để tải lên từng file
      const uploadResults = await Promise.all(
        files.map(async (file) => {
          const formData = new FormData();
          formData.append("file", file); // Truyền file thực tế
          formData.append(
            "upload_preset",
            process.env.REACT_APP_CLOUDINARY_NAME
          );

          try {
            const response = await fetch(URL, {
              method: "POST",
              body: formData,
            });

            if (!response.ok) {
              throw new Error("Upload failed");
            }

            const data = await response.json();
            return data; // Lưu thông tin file tải lên thành công
          } catch (error) {
            console.error("Error uploading file:", file.name, error);
            return { error: `Failed to upload ${file.name}` }; // Trả lỗi cho từng file
          }
        })
      );

      const cloudImgs = [];
      uploadResults.map((img) => {
        cloudImgs.push(img.url);
      });

      onFilesUploaded(cloudImgs);

      setUploadNotice("success");
      setUploadStatus("success");
    } catch (e) {
      setUploadNotice("error");
      setUploadStatus("Tải ảnh lên thất bại. Vui lòng thử lại"); // Nếu lỗi
      console.error("Error uploading files:", e);
    }
  };

  return (
    <>
      <div
        {...getRootProps()}
        className=" border-secondary d-flex justify-content-center align-items-center mx-auto mb-3"
        style={{
          width: "100%",
          maxWidth: "500px", // Giới hạn chiều rộng tối đa
          height: "200px", // Chiều cao cố định
          backgroundColor: "initial",
          cursor: "pointer",
          borderRadius: "20px",
          borderStyle: "dashed",
        }}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Thả các ảnh vào đây</p>
        ) : (
          <p>Thả các ảnh vào đây, hoặc bấm vào đây để thêm ảnh.</p>
        )}
      </div>
      <p
        style={{
          fontWeight: "bold",
          fontSize: "1rem",
          marginBottom: "1rem",
        }}
      >
        Danh sách ảnh:{" "}
      </p>
      <ul className="xs-d-flex xs-flex-wrap" style={{ listStyleType: "none" }}>
        {files.map((file, index) =>
          file.preview ? (
            <li
              key={index}
              style={{ position: "relative", display: "inline-block" }}
              className="my-1"
            >
              <img
                src={file.preview}
                alt=""
                className="mx-1 border rounded img-fluid"
                style={{
                  width: "100px",
                  height: "100px",
                }}
                onLoad={() => URL.revokeObjectURL(file.preview)}
              />
              <Button
                className="btn btn-warning"
                onClick={() => removeImg(index)}
                style={{
                  position: "absolute",
                  top: "-10px",
                  right: "-10px",
                  background: "red",
                  color: "white",
                  border: "none",
                  borderRadius: "50%",
                  height: "35px",
                  cursor: "pointer",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <FontAwesomeIcon icon={faX} size="sm" />
              </Button>
            </li>
          ) : null
        )}
      </ul>

      {rejected.length > 0 ? (
        <p style={{ color: "red", fontWeight: "bold" }}>
          Có 1 số ảnh không được thêm do lớn hơn 3MB!!!
        </p>
      ) : (
        <> </>
      )}

      <div className="d-flex xs-flex-row-reverse ">
        <Button
          variant="outline-dark"
          onClick={(e) => handleSumbit(e)}
          className="mx-2"
        >
          Lưu hình ảnh
        </Button>
        <div>
          {uploadStatus && (
            <p
              style={
                uploadNotice === "success"
                  ? { color: "green" }
                  : { color: "rgb(253, 187, 47)" }
              }
            >
              {uploadStatus === "success" ? (
                <FontAwesomeIcon
                  icon={faCircleCheck}
                  size="lg"
                ></FontAwesomeIcon>
              ) : (
                uploadStatus
              )}
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default Dropzone;
