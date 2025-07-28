'use client'

import { ChangeEvent, Dispatch, FormEvent, SetStateAction, useState } from "react"
import Filter from "./Filter"
import { ListOption } from "@/lib/customTypes"

interface FormElements extends HTMLFormControlsCollection {
    studyGuideInput : HTMLInputElement
}

interface StudyGuideFormElement extends HTMLFormElement {
    readonly elements : FormElements
}

export default function SearchBar( { setQuery, setFilter, options } : { setQuery : Dispatch<SetStateAction<string>>, setFilter : Dispatch<SetStateAction<string>>, options : ListOption[] }) {
    const [value, setValue] = useState("")
    const changeHandler = (e : ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value)
    }
    const submitHandler = (e : FormEvent<StudyGuideFormElement>) => {
        e.preventDefault()
        setQuery(e.currentTarget.elements.studyGuideInput.value)
    }

    return (    
        <div className="relative flex flex-row justify-center items-center">
            <form onSubmit={submitHandler}>
                <input 
                    placeholder="Search for study guides here:"
                    onChange={changeHandler}
                    value={value}
                    type="text"
                    className="border-2 rounded-2xl px-5 py-2.5 w-145 transition-all duration-175 ease-in-out border-purple-700 focus:border-purple-700 focus:placeholder-purple-700 focus:outline-none focus:ring-0 placeholder-purple-400 hover:placeholder-purple-700 hover:bg-gray-100"
                />
            </form>
            <Filter setFilter={setFilter} options={options} />
            
        </div>
    )
}

