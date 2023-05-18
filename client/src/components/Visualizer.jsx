import React, { useRef, useState, useEffect, useCallback, Suspense } from "react";

import "./Visualizer.css";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls, Environment, ContactShadows, PerspectiveCamera, Text, useFont} from "@react-three/drei";
import axios from "axios";
import * as THREE from 'three'
import { useMotionValue, MotionConfig } from "framer-motion";
import { motion } from "framer-motion-3d";
import Modelos from "./ESguitar";
import { useDispatch, useSelector } from "react-redux";
import { addColor } from "../features/Colors";

import { Perf } from "r3f-perf";
import MyDropzone from "./Dropzone";

import Tweaker from "./Tweaker/Tweaker";
import TweakerTele from "./Tweaker/TweakerTele";
import ESguitar from "./ESguitar";
import Teleguitar from "./Teleguitar";
import { Button } from "primereact/button";
import { FloppyDisk } from "@phosphor-icons/react";

function Visualizer({ guitarsList, model, setModel, changed, setChanged }) {
  const colus = useSelector((state) => state.guitar_set.colorSet);
  const triggs = useSelector((state) => state.guitar_set.dropped);


const orbCam = useRef()
const gtrnameref =useRef()


  const [colorList, setColorList] = useState(colus);
  const [clickedPart, setClickedPart] = useState("");
  const [gtrNameInput, setGtrNameInput] = useState("");
  const [gtrName, setGtrName] = useState("");
  const [dropped, setDropped] = useState(triggs);
  const dispatch = useDispatch();


const fontPath = '/NothingYouCouldDo-regular.ttf'
console.log(fontPath)

  const handleSelectGuitar = async (e) => {
const gtr = e.target.value
console.log(gtr)
   axios.get(`${import.meta.env.VITE_BACKEND_URL}/items/fetchguitar`,{params :{gtr : gtr}}).then((res) => {

     const fetched = res.data
    const object = Object.values(fetched).reduce((acc, item) => {
   
      acc[item.name] = item.color
     acc.id = item.id_guitar
     acc.gloss = item.gloss
     acc.wood = parseInt(item.wood,10)
     acc.scratch = parseInt(item.scratch,10)
    item.id_texture  ? acc.texture_path = "stocked/1681217837265.png" : item.texture_path

      return acc;
    }, {});

        setModel(fetched[0].model)
      setColorList(object)   
       console.log(typeof object.scratch)
    })
  };




const resetCam =() => {
  console.log(orbCam.current)
  orbCam.current.reset()
  // orbCam.current.lookAt = [0,1,0]
}

  const addGuitar = () => {
    axios.post(`${import.meta.env.VITE_BACKEND_URL}/items/saveguitar`, {
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
      metal_pieces: colorList.metal_pieces,
      pickup_cover: colorList.pickup_cover,
      pickup_ring: colorList.pickup_ring,
      knobs: colorList.knobs,
      texture_path: colorList.texture_path,
      gloss: colorList.gloss,
      scratch: colorList.scratch,
      body: colorList.body,
      wood: colorList.wood,
      pickguard: colorList.pickguard,
      single_plastic: colorList.single_plastic,
      single_metal: colorList.single_metal,
      backplate: colorList.backplate,
    });
  };

  useEffect(() => {}, [handleSelectGuitar, model]);

  const [allTx, setAllTx] = useState([]);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_BACKEND_URL}/stocked`).then((response) => {
      let filesReached = [];

      filesReached.push(response.data);
      setAllTx(filesReached);
   
    });

    // )
  }, [triggs]);

const handleGtrNameSet =  () => {
  setGtrName(gtrNameInput)
  setGtrNameInput('')
}

function GuitarName(){
  useFrame(({ camera }) => {
  // Make text face the camera
  gtrnameref.current.quaternion.copy(camera.quaternion)

})




return(
  <group          ref={gtrnameref} position={[0.2,-0.5,0.9]} scale={0.2}>
  <Suspense fallback={null}>
  
            <Text
          
  
          color={'#000000'}
          fontSize={2}
          maxWidth={3}
 
          lineHeight={.8}
          // letterSpacing={0.02}
          textAlign={'left'}
          // depthOffset={100}
          // glyphGeometryDetail={0}
          // font="/NothingYouCouldDo-Regular.ttf"
          // font="/Quentin.otf"
          font="/Summer_Pisces.ttf"
          anchorX="-60%"
          anchorY="middle"
          outlineOffsetX={'-1%'}
          outlineOffsetY={'1%'}
          // fillOpacity={0}
          outlineOpacity={1}
          // outlineColor="#020202" 
             strokeWidth={0}
          outlineWidth={0.02}
          >
            <meshBasicMaterial
           side={THREE.DoubleSide}
           color={'#000000'}
           transparent
       
           opacity={1}
         />
          {gtrName}
          <group position={[0,0,0.01]}  scale={1.01}>

  
            <Text
      
          color={'#000000'}
      
          fontSize={2}
          maxWidth={3}
          fontWeight={'bold'}
          lineHeight={.8}
          // letterSpacing={0.02}
          textAlign={'left'}
          fillOpacity={0}
          glyphGeometryDetail={0}
    
          font="/Summer_Pisces.ttf"

          anchorX="-60%"
          anchorY="middle" 
           outlineBlur={'2%'}
          outlineOpacity={0.9}
          outlineColor="#000000"
          >
            <meshBasicMaterial
           side={THREE.DoubleSide}
           color={'#000000'}
           transparent
           opacity={1}
         />
          {gtrName}
        </Text>
   
          </group>
        </Text>

        <Text
          position={[4,-1,0.2]}
  
          color={'#000000'}
      
          fontSize={1}
          maxWidth={3}
          fontWeight={'bold'}
          lineHeight={.8}
          // letterSpacing={0.02}
          textAlign={'left'}
          fillOpacity={1}
          glyphGeometryDetail={0}
    
          font="/Summer_Pisces.ttf"
          strokeWidth={0}
          outlineWidth={0.002}
          anchorX="100%"
          anchorY="middle" 
           outlineBlur={'2%'}
          outlineOpacity={0.9}
          outlineColor="#000000"
          >
            <meshBasicMaterial
           side={THREE.DoubleSide}
           color={'#000000'}
           transparent
           opacity={1}
         />
         by {gtrName}
        </Text>
          </Suspense>
          </group>
          
)
}








      
  return (
    <div className="mainviz">
      <div className="visualizer">
        <div    className="canvas">
          
        <Canvas
       
          fallback={null}
          camera={{ position: [0, 0, 3], fov: 60 }}
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

        >
          {/* <PerspectiveCamera ref={orbCam}   position={[0, 2, 3]} fov={60}/> */}
          <OrbitControls  ref={orbCam} target={[0, 0, 0]}  enableZoom={false} position0={[0,0,3]}/>
          <Environment files="/decor_shop_2k.hdr" blur={2} />

          <ambientLight intensity={0.4} />
          <directionalLight
            castShadow
            intensity={3}
            position={[0, 5, 0.5]}
            lookAt={[0, 0, 0]}
            shadow-mapSize-height={1024}
            shadow-mapSize-width={1024}
          />         
      
          <MotionConfig
            transition={{
              type: "spring",
              duration: 2,
              ease: "easeInOut",
              // times: [0,  1],
              repeat: 0,
              repeatDelay: 1,
            }}
          >
  <ContactShadows
                depthWrite={false}
            //  matrixAutoUpdate={true}
            position={[0, -1.3, 0]}
            opacity={0.85}
            scale={10}
            blur={0.7}
            far={5}
            frames={100}
            resolution={512}
          />


            <motion.group animate={model === '1' ? "es335" : "tele"}>
              <motion.group
                variants={{
                  es335: { opacity: 0, x: 0 },
                  tele: {
                    x: 10,
                    scale: 0,
                  },
                }}
              >           
     
                <ESguitar
                  setColorList={setColorList}
                  colorList={colorList}
      
                  setClickedPart={setClickedPart}
                  tilt={[-Math.PI / 7, -0.2, -Math.PI * 0.3]}
                  pos={[-1,-0.5, -0.3]}
                />
       

              </motion.group>

              <motion.group
                variants={{
                  es335: { x: -10, scale: 0, visibility: 0 },
                  tele: {},
                }}
              >
                <Teleguitar
                  setColorList={setColorList}
                  colorList={colorList}
      
                  setClickedPart={setClickedPart}
                  tilt={[-Math.PI / 7, -0.2, -Math.PI * 0.3]}
                  pos={[-1, -0.8, -0.4]}
                />
              </motion.group>
            </motion.group>
          </MotionConfig>
          {/* <Perf deepAnalyze={true} position={"top-left"} /> */}
          {gtrName &&(

            <GuitarName/>
          )}
     </Canvas> 
        {model == 1 && (
          <Tweaker
       
            colorList={colorList}
            setColorList={setColorList}
          resetCam={resetCam}
          setDropped={setDropped}
          dropped={dropped}
          />
        )}
        {model == 2 && (
          <TweakerTele
            colorList={colorList}
            setColorList={setColorList}
            setDropped={setDropped}
            dropped={dropped}
            resetCam={resetCam}
          />
        )}
      </div>
       
      </div>
      <div id="select-guitarset">
      <FloppyDisk size={56} />
      <div className="guitar-name">
        <input  type="text" value={gtrNameInput} onChange={(e) => setGtrNameInput(e.target.value)} placeholder="Give it a name..."></input><button onClick={handleGtrNameSet}>ok</button></div>
        <Button
         onClick={(e) => (e.stopPropagation(), addGuitar())}
        // onClick={() => orbCam.current.reset()}
         >
          Save this guitar
        </Button>
        <select name="" id="" onClick={(e) => handleSelectGuitar(e)}>
          {guitarsList &&
            guitarsList.map((guitar, key) => (
              <option value={guitar.name} key={key}>
                {guitar.name}
              </option>
            ))}
        </select>
      </div>
    </div>
  );
}

export default Visualizer;
