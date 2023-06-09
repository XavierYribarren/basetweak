import axios from "axios";
import React, { useCallback, useEffect } from "react";
import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { addColor, triggerDrop } from "../features/Colors";
import { useDispatch, useSelector } from "react-redux";
import "./Tweaker/Dropzone.css";
import {
  textureAdd,
  textureDelete,
  textureAssign,
  textureClear,
} from "../features/TextureReducer";
import { v4 as uuidv4 } from "uuid";
import TextureSelect from "./Tweaker/Multiselect";
import { Trash } from "@phosphor-icons/react";

function MyDropzone({
  setDropped,
  dropped,
  selectedParts,
  setSelectedParts,
  files,
  setFiles,
  model,
  showPreview
}) {
  const thumb = {
    borderRadius: 2,
  };

  const thumbInner = {
    minWidth: 30,
    overflow: "hidden",
  };

  const img = {
    display: "flex",
    maxWidth: "8vw",
    height: "auto",
    objectFit: "cover",
  };

  const imgs = [];

  const path = `${import.meta.env.VITE_BACKEND_URL}`;

  // const [showPreview, setShowPreview] = useState(false);
  const dispatch = useDispatch();

  const onDrop = useCallback((acceptedFiles) => {
    const updatedFiles = acceptedFiles.map((file) => {
      const modifiedFilename = file.name
        .replace(/[^A-Za-z0-9.\s]/g, "")
        .replace(/\s/g, "")
        .replace(/[\u2018\u2019]/g, "")
        .toLowerCase();

      console.log("MOD", modifiedFilename);
      console.log(file);
      return {
        id: uuidv4(),
        file,
        preview: URL.createObjectURL(file),
        modifiedFilename, // Add the modified filename to the file object
      };
    });
    setFiles((prevFiles) => [...prevFiles, ...updatedFiles]);

    const formData = new FormData();
    updatedFiles.forEach((img) => {
      formData.append("file", img.file);
      formData.append("id", img.id);
    });
    axios
      .post(`${import.meta.env.VITE_BACKEND_URL}/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        console.log(response.data);
      })
      .then(setDropped(dropped + 1))
      // .then(dispatch(addColor(colorList)))
      .then(dispatch(triggerDrop(dropped)))
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    noClick: true,

    onDrop,
  });

  useEffect(() => {
    const filesId = [];
    if (files && filesId.length > 0) {
      files.forEach((file) => {
        if (!filesId.includes(file.modifiedFilename)) {
          filesId.push(file.modifiedFilename);
        }
      });

      //  dispatch(textureAdd(filesId));
    }
    // console.log(files);
  }, [setFiles, dispatch]);



  useEffect(() => {}, [selectedParts, model]);

  const handleDeleteImg = (fileModName) => {
    console.log(fileModName, files);
    setFiles((prevState) =>
      prevState.filter((file) => file.modifiedFilename !== fileModName)
    );
    const removed = files.filter(
      (part) => part.modifiedFilename == fileModName
    );
    console.log(removed);
    // dispatch(textureDelete(removed.modifiedFilename))
    dispatch(textureClear(fileModName));
  };

  const handleLoad = (file) => {
    URL.revokeObjectURL(file.preview);
  };

  const thumbs = files.map((file) => (
    <>
      <div className={showPreview ? "preview-tex" : "preview-tex-hidden"}>
        <div style={thumb} key={file.name}>
          <TextureSelect
            key={file.name}
            selectedParts={selectedParts}
            setSelectedParts={setSelectedParts}
            fileModName={file.modifiedFilename}
            model={model}
          />
          <div style={thumbInner}>
            <button
              key={file.name}
            className="trash-button"
              type="button"
              value={file.modifiedFilename}
              onClick={(e) => {
                e.preventDefault(), handleDeleteImg(file.modifiedFilename);
              }}
            >
              <span><Trash size={26} color={"red"} /></span>
            </button>
            {files.some((f) => f.id === file.id) && (
              <img src={file.preview} style={img} onLoad={handleLoad} />
            )}
          </div>
        </div>
      </div>
    </>
  ));

  useEffect(() => {
    return () => files.forEach((file) => URL.revokeObjectURL(file.preview));
  }, []);

  return (
    <>
  <div className="dropzone-visible">

      <form encType="multipart/form-data">
        <section className="dropzone-container">
          <div {...getRootProps()} className="dropzone-div">
            <input {...getInputProps()} type="file" />
            <div className={files.length !== 0 ? 'dragtext-hidden' : 'dragtext-visible'}>

            {isDragActive ? (
              <p>Drop the files here ...</p>
              ) : (
                <p >Drag 'n' drop some files here</p>
                )}
                </div>

            <div className={showPreview && files.length !== 0? "exaside" :"exaside-hidden"}>{thumbs}</div>
          </div>
        </section>
      </form>
                </div>
    </>
  );
}
export default MyDropzone;
