import React, { useRef, useState, useEffect, useCallback } from "react";

import "./Visualizer.css";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, ContactShadows } from "@react-three/drei";
import axios from "axios";
import { useMotionValue, MotionConfig } from "framer-motion";
import { motion} from "framer-motion-3d"
import Modelos from "./ESguitar";
import { useDispatch, useSelector } from "react-redux";
import { addColor } from "../features/Colors";

import { Perf } from "r3f-perf";
import MyDropzone from "./Dropzone";

import Tweaker from "./Tweaker/Tweaker";
import TweakerTele from "./Tweaker/TweakerTele";
import ESguitar from "./ESguitar";
import Teleguitar from "./Teleguitar";

function Visualizer({ guitarsList, model, setModel, changed, setChanged }) {
  const colus = useSelector((state) => state.guitar_set.colorSet);
  const triggs = useSelector((state) => state.guitar_set.dropped);

  const [colorList, setColorList] = useState(colus);
  // const [col335, setCol335] = useState(colorList.es335)
  // const [colTele, setColTele] = useState(colorList.telecaster)
  const [clickedPart, setClickedPart] = useState("");
  const [gtrName, setGtrName] = useState("");
  const [dropped, setDropped] = useState(triggs);
  const dispatch = useDispatch();
  const handleSelectGuitar = async (e) => {
    const chosen = guitarsList.filter(
      (item) => item.id == e.target.value
    );
    await setColorList(chosen[0]);
    setModel(chosen[0].guitar_id);
    // console.log(colorList)
  };

  const addGuitar = () => {
    axios.post("http://localhost:3001/items/saveguitar", {
      id: model,
      gtrname: gtrName,
      side: colorList.side,
      binding: colorList.binding,
      tablefront: colorList.tablefront,
      tableback: colorList.tableback,
      neckwood: colorList.neckwood,
      fretboard: colorList.fretboard,
      fretbinding: colorList.fretbinding,
      frets: colorList.frets,
      inlay: colorList.inlay,
      nut: colorList.nut,
      metalpieces: colorList.metalpieces,
      pickup_cover: colorList.pickup_cover,
      pickup_ring: colorList.pickup_ring,
      knobs: colorList.knobs,
      texture_path: colorList.texture_path,
      gloss: colorList.gloss,
      scratch: colorList.scratch,
      body: colorList.body,
      pickguard: colorList.pickguard,
      single_plastic: colorList.single_plastic,
      single_metal: colorList.single_metal,
      backplate: colorList.backplate
    });
  };

  const x = useMotionValue(0)
  const variants = {
    bouge : {
    scale: [1, 2, 2, 1, 1],
    rotate: [0, 0, 180, 180, 0],
   x : ['0px', '-1000px'],
    borderRadius: ["0%", "0%", "50%", "50%", "0%"],
  }}
  
  const [bip, setBip] = useState(false)
  const resetAnimation = () => {
    setBip(false);
  };
  useEffect(() => {}, [handleSelectGuitar]);

  const [allTx, setAllTx] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:3001/stocked").then((response) => {
      let filesReached = [];

      filesReached.push(response.data);
      setAllTx(filesReached);
    });

    // )
  }, [triggs]);

  return (
    <div className="mainviz">
      <div className="visualizer">
        <Canvas
          className="canvas"
          fallback={null}
          camera={{ position: [0, 2, 3], fov: 60 }}
          // shadows ={{type : PCFSoftShadowMap}}
    linear
          shadows
          dpr={[1, 2]}
          // linear
          gl={{
            preserveDrawingBuffer: true,
            antialias: true,
            alpha: true,
          }}
          onPointerOut={() => setTimeout(() => setClickedPart(""), 2000)}
        >
          <OrbitControls target={[0, 1, 0]} enableZoom={false} />
          <Environment 
                    files='/decor_shop_2k.hdr'
           blur={2} />

          <ambientLight intensity={0.4} />
          <directionalLight
            castShadow
            intensity={3}
            position={[0, 5, 0.5]}
            lookAt={[0, 0, 0]}
            shadow-mapSize-height={1024}
            shadow-mapSize-width={1024}
          />
          <ContactShadows
            //  matrixAutoUpdate
            position={[0, -0.8, 0]}
            opacity={0.85}
            scale={10}
            blur={0.5}
            far={5}
            frames={1}
            resolution={512}
          />
      

          <MotionConfig transition={{
  type: 'spring',
    duration: 2,
    ease: "easeInOut",
    // times: [0,  1],
    repeat: 0,
    repeatDelay:1

}} >
             <motion.group
      
              animate={model == 1 ? "es335" : "tele"}
            
         
             >
             < motion.group 
   variants={{
    es335: { opacity: 0,
    x: 0 },
   tele : {
 
      x:10,
      scale : 0

  },
  }}>


            <ESguitar
              setColorList={setColorList}
              colorList={colorList}
              clickedPart={clickedPart}
              setClickedPart={setClickedPart}
              dropped={dropped}
              setDropped={setDropped}
              tilt={[-Math.PI / 7, -0.2, -Math.PI * 0.3]}
              pos={[-1, -0.2, -0.3]}
            /></motion.group>

          <motion.group 
   variants={{
    es335: {    x:-10,
    scale: 0,
     visibility: 0 },
    tele : {
   
  },
  }}>
            <Teleguitar
              setColorList={setColorList}
              colorList={colorList}
              clickedPart={clickedPart}
              setClickedPart={setClickedPart}
              tilt={[-Math.PI / 7, -0.2, -Math.PI * 0.3]}
              pos={[-1, -0.2, -0.3]}
            /></motion.group>

</motion.group></MotionConfig>
          <Perf deepAnalyze={true} position={"top-left"} />
        </Canvas>
        <MyDropzone
          colorList={colorList}
          setColorList={setColorList}
          setDropped={setDropped}
          dropped={dropped}
        />
     {model == 1 && (   <Tweaker
          colorList={colorList}
          setColorList={setColorList}
          clickedPart={clickedPart}
        />)}
             {model == 2 && (   <TweakerTele
          colorList={colorList}
          setColorList={setColorList}
          clickedPart={clickedPart}
        />)}
      </div>
      <div id="select-guitarset">
        <input type="text"  onChange={(e) => setGtrName(e.target.value)}></input>{" "}
        <button
          // style={{ position: "absolute" }}
          // onClick={() => setBip(!bip)}
          onClick={(e) => (e.stopPropagation(), addGuitar())}
        >
          Save this guitar
        </button>
        <select name="" id="" onClick={(e) => handleSelectGuitar(e)}>
          {guitarsList &&
            guitarsList.map((guitar, key) => (
              <option value={guitar.id} key={key}>
                {guitar.id}
              </option>
            ))}
        </select>
      </div>
    </div>
  );
}

export default Visualizer;
