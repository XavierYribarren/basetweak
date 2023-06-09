import React, { useEffect, useState } from "react";
import { MultiSelect } from 'primereact/multiselect';
// import 'primereact/resources/themes/lara-light-blue/theme.css';   // theme
import 'primereact/resources/primereact.css'; 
import './Multiselect.css' 
import 'primeicons/primeicons.css';                                 // icons
import { useDispatch, useSelector } from "react-redux";
import { textureAdd, textureDelete } from "../../features/TextureReducer";
// import 'primeflex/primeflex.css'; 


export default function TextureSelect({selectedParts, setSelectedParts, fileModName, model}) {

    const toPascalCase = (str) =>
    (str.match(/[a-zA-Z0-9]+/g) || [])
      .map((w) => `${w.charAt(0).toUpperCase()}${w.slice(1)}`)
      .join(" ");

 const partsTx = useSelector((state) => state.texture_data.texture_assign)
 console.log(fileModName)
 const partsAv = Object.keys(partsTx).map((part) => ({name : part, file: fileModName}))
 
//  console.log(partsTx, partsAv)
//  const [partsSelected, setPartsSelected] = useState([])
const partsAv335 = partsAv.filter((part) => part.name !== 'Pickguard' && part.name !== 'Body')
const partsAvTele = partsAv.filter((part) => part.name !== 'Back' && part.name !== 'Side' && part.name !== 'Front')

console.log(partsAvTele)

const dispatch = useDispatch()


useEffect(() => {

dispatch(textureAdd(selectedParts))
},[selectedParts])

  
const handleSelect = (e) => {
 console.log(selectedParts)
    if(selectedParts.length > e.value.length){
        const removed = selectedParts.filter(part => !e.value.includes(part))
        dispatch(textureDelete(removed))

    
    }


    setSelectedParts(e.value)

}


    return (
        <div className="multi-sel" key={fileModName}>
            <MultiSelect value={selectedParts} onChange={(e) => {
                // console.log(e),
            // setPartsSelected(e.value)
            handleSelect(e)
        }} 
        options={model == 1 ? partsAv335 : partsAvTele} optionLabel="name" 
                placeholder="Select Parts" maxSelectedLabels={3}  />
        </div>
    );
}