'use client'

import { Dispatch, SetStateAction, useEffect, useState } from "react"
import Dropdown from "./Dropdown"
import { Tag } from "@prisma/client"
import { isTag } from "@/lib/prismaTypes"

function SearchField({ placeholder, setTags } : { placeholder : string, setTags : Dispatch<SetStateAction<Tag[]>> }) {
    const [value, setValue] = useState("")

    useEffect(() => {

    }, [])

    const onClick = (value : unknown) => {
        if (isTag(value)) {
            setTags(prev => [...prev, value])
        }
    }
    
    return (
        <div>
            <input
                value={value}
                onChange={(e) => {
                    setValue(e.currentTarget.value)
                }}
                placeholder={placeholder}
            />
            <Dropdown options={} onClick={onClick} />
        </div>
    )
}

function InputField({ title, isSearch, placeholder, setTags } : { title : string, isSearch : boolean, placeholder : string, setTags : Dispatch<SetStateAction<Tag[]>> | null }) {
    const [value, setValue] = useState("")

    if (isSearch === false) {
        return (
            <div>
                <h1>{title}</h1>
                <input
                    value={value}
                    onChange={(e) => {
                        setValue(e.currentTarget.value)
                    }}
                    placeholder={placeholder}
                />
            </div>
        )
    } else if (setTags) {
        return <SearchField placeholder={placeholder} setTags={setTags} />
    } else {
        console.error("Modal Creation Error, setTags was not null but inputField was not a search field")
        return <div></div>
    }
    
    
}

function Head() {
    return (
        <div>
            <h1>Create Study Guide</h1>
            <h3>Enter a name and optional tags for your study guide</h3>
        </div>
    )
}

function Body({ setTags } : { setTags: Dispatch<SetStateAction<Tag[]>>}) {
    return (
        <div>
            <InputField title="Name" placeholder="Ex: Algebra" isSearch={false} setTags={null} />
            <InputField title="Tags (optional)" placeholder="Search or create tags" isSearch={true} setTags={setTags} />
        </div>
    )
}
export default function Modal({ active } : { active : boolean }) {
    const [tags, setTags] = useState<Tag[]>([])


    return (
        <div className="absolute top-[50%] right-[50%]">
            <Head />
            <Body setTags={setTags} />
        </div>  
    )
}
