'use client'

import { DDConfig, ListOption } from "@/lib/customTypes";
import { Dispatch, SetStateAction, useState } from "react";
import Dropdown from "./Dropdown";

export default function Filter({ setFilter, options } : { setFilter : Dispatch<SetStateAction<string>>, options: ListOption[] }) {
   
    const [visible, setVisible] = useState(false)

    const clickHandler = (value : unknown) => {
        if (typeof value === 'string') {
            setFilter(value)
        } else {
            console.error('value isn\'t a string')
        }
        
    }

    const config : DDConfig = {
        hover: "",
        height: "h-30",
        width: "w-19",
        backgroundColor: "bg-purple-700",
        textColor: "text-white",
        fontSize: "text-xl",
        fontWeight: "font-bold",
        header: null,
        footer: null,
        headerClick: null,
        footerClick: null,
    }

    return (
        <div className="ml-6">
            <button className='w-full text-white bg-purple-700 p-4 rounded-xl hover:bg-purple-800 font-bold transition-all duration-175 ease-in-out' onClick={() => {
                setVisible(!visible)
            }}>Filter</button>
            <Dropdown options={options} onClick={clickHandler} config={config} visible={visible} />
        </div>
    )
}
