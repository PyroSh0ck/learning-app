'use client'

import { useState, useEffect } from 'react'
import { Tag } from '@prisma/client'

export default function Root({ modalOpen } : { modalOpen : boolean }) {

    const [dropdownOpen, setDropdownOpen] = useState(false)
    const [input1, setInput1] = useState('')
    const [input2, setInput2] = useState('')
    const [input3, setInput3] = useState('#000000')
    const [dropdownOptions, setDropdownOptions] = useState<Tag[]>([])
    const [tagList, setTagList] = useState<string[]>([])
    const [selectedTags, setSelectedTags] = useState<Tag[]>([])
    const [tagEditOpen, setTagEditOpen] = useState(false)

    useEffect(() => {
        const query = async () => {
            const res = await fetch(`/api/tags?name=${input2}`)
            const data : Tag[] = await res.json() // data is going to be an array of tags
            setDropdownOptions(data)
            const tempArr : string[] = []
            data.forEach(option => {
                tempArr.push(option.name)
            });
            setTagList(tempArr)
        }
        query()
    }, [input2])

    const dropdownClickHandler = ( tag : Tag ) => {
        setSelectedTags([...selectedTags, tag])
        setDropdownOpen(false)
    }

    const createTagHandler = async () => {
        
    }
    
    const updateTagHandler = async () => {

    }


    return (
        <div className={`root-holder flex-row justify-center items-center ${ modalOpen ? 'flex' : 'hidden' }`}>
            <div className='modal-wrapper flex flex-col justify-center items-start'>
                <div className="x self-end"></div>
                <div className="heading-wrapper flex flex-col justify-center items-start">
                    <h1 className="heading"></h1>
                    <p className="subheading"></p>
                </div>
                <div className="input-wrapper flex flex-col justify-center items-start">
                    <h1 className="input-label"></h1>
                    <input
                        value = {input1}
                        onChange = {(e) => {
                            setInput1(e.target.value)
                        }}
                        type='text'
                        placeholder='Ex: Algebra'
                    />
                </div>
                <div className="search-input-wrapper relative flex flex-col justify-center items-start">
                    <h1 className="input-label"></h1>
                    <input 
                        value = {input2}
                        onChange = {(e) => {
                            if (!tagEditOpen) {
                                setInput2(e.target.value)
                            } else {
                                // show an error saying close tag edit first :p
                            }
                        }}
                        type='text'
                        placeholder='Search or create tags'
                    />
                    <div className={`dropdown-wrapper overflow-y-scroll flex-col justify-start items-center absolute top-full ${ dropdownOpen ? 'flex' : 'hidden' }`}>
                        {
                            (input2.trim() !== "" && !tagList.includes(input2.trim())) ? (
                                <div className="createTag sticky top-0 z-10" onClick={() => {
                                    setTagEditOpen(true)
                                }}></div>
                            ) : ""
                        }
                        {dropdownOptions.map(tag => (
                            <div key={tag.id} className="dropdownTag" onClick={() => {
                                dropdownClickHandler(tag)
                            }}></div>
                        ))}
                    </div>
                </div>
                <div className="selected-tags-wrapper flex flex-row justify-start items-center">
                    {selectedTags.map(tag => (
                        <div key={`selected_${tag.id}`} className="selectedTag flex flex-row justify-center items-center space-evenly">
                            <h1 className="selectedTagText">{tag.name}</h1>
                            <div className="selectedTagX"></div>
                        </div>
                    ))}
                </div>
                <div className="buttons-wrapper flex flex-row justify-end items-center"></div>
            </div>
            <div className={`editor-wrapper flex-col justify-center items-start ${ tagEditOpen ? 'flex' : 'hidden' }`}>
                <h1>Create or Update Tag</h1>
                <div className="tagName">Tag Name: {input2.trim()}</div>
                {
                    tagList.includes(input2.trim()) ? (
                        <>
                            <div className="colorPicker-wrapper flex flex-row justify-start items-center">
                                <h1>Choose a Color: </h1>
                                <input
                                    value = {dropdownOptions.find((value) => (value.name === input2))?.color ?? input3}
                                    type='color'
                                    onChange={(e) => {
                                        setInput3(e.target.value)
                                    }}
                                />
                            </div>
                            <button onClick={updateTagHandler}>Update Tag</button>
                        </>
                    ) : (
                        <>
                            <div className="colorPicker-wrapper flex flex-row justify-start items-center">
                                <h1>Choose a Color: </h1>
                                <input
                                    value = {input3}
                                    type='color'
                                    onChange={(e) => {
                                        setInput3(e.target.value)
                                    }}
                                />
                            </div>
                            <button onClick={createTagHandler}>Create Tag</button>
                        </>
                    )
                }
            </div> 
        </div>
    )
}
