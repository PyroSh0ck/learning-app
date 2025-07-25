'use client'

import { DDConfig, ListOption } from "@/lib/customTypes";
import { Dispatch, SetStateAction } from "react";
import Dropdown from "./Dropdown";

export default function Filter({ setFilter, options } : { setFilter : Dispatch<SetStateAction<string>>, options: ListOption[] }) {
   
    const clickHandler = (value : string) => {
        setFilter(value)
    }

    const config : DDConfig = {
        hover: "",
        height: "h-40",
        width: "w-20",
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
        <div>
            <button>Filter</button>
            <Dropdown options={options} onClick={clickHandler} config={config} />
        </div>
    )
}
