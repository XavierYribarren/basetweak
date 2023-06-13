

  import React, { useRef, useState } from "react";
  import { useGLTF } from "@react-three/drei";
  
function Metalpieces() {

    // const { nodes, materials } = useGLTF("/products/product-metalpieces.glb", "/products/product-metalpiecesTele.glb");


    const [partModel, setPartModel] = useState("ES335")


    
    // if (partModel === "ES335"){
   
    //   const { nodes, materials } = useGLTF("/products/product-metalpieces.glb" );
    //   return {nodes, materials}
    //  }
    // if (partModel == "Tele" ){
    //  const { nodes, materials } = useGLTF("/products/product-metalpiecesTele.glb") 
    //  return {nodes, materials}
    // }
     
    return (
      <group dispose={null}>
        {/* <mesh
          castShadow
          receiveShadow
          geometry={nodes.selector.geometry}
          material={materials["metalpieces.001"]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.gibson.geometry}
          material={materials["metalpieces.001"]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.InputJack_Cover_Assembly_1.geometry}
          material={materials.metalpieces}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.InputJack_Cover_Assembly_2.geometry}
          material={materials.greymetal}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.InputJack_Cover_Assembly_3.geometry}
          material={materials.wood}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.tail_saddle.geometry}
          material={materials["metalpieces.001"]}
        /> */}
      </group>
    );
  }
  
  useGLTF.preload("/product-metalpieces.glb");
  

export default Metalpieces