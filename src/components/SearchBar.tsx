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
        <div className="flex flex-row justify-center items-center">
            <form onSubmit={submitHandler}>
                <input 
                    placeholder="Search for study guides here:"
                    onChange={changeHandler}
                    value={value}
                    type="text"
                />
            </form>
            <Filter setFilter={setFilter} options={options} />
            
        </div>
    )
}

