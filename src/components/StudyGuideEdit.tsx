'use client'

import { useState, useEffect, Dispatch, SetStateAction, FormEvent, useRef } from 'react'
import { Tag } from '@prisma/client'
import { ConnectStruct } from '@/lib/customTypes'
import { StudyGuide_f } from '@/lib/prismaTypes'
import { Fragment } from 'react'

const isUnique = ( tagIDs : ConnectStruct[], tags : Tag[] ) => {
    if (tagIDs.length === tags.length) {
        const idsA = new Set(tagIDs.map(tag => tag.id))
        const idsB = new Set(tags.map(tag => tag.id))
        
        for (const id of idsA) {
            if (!idsB.has(id)) return true
        }
        return false
    } else {
        return true
    }
}

export default function StudyGuideEdit({ modalOpen, setModalOpen, setGuide, guide } : { modalOpen : boolean, setModalOpen : Dispatch<SetStateAction<boolean>>, setGuide : Dispatch<SetStateAction<StudyGuide_f | undefined>>, guide : StudyGuide_f }) {



    const [dropdownOpen, setDropdownOpen] = useState(false)
    const [input1, setInput1] = useState('')
    const [input2, setInput2] = useState('')
    const [input4, setInput4] = useState('')
    const [input5, setInput5] = useState('')
    const [dropdownOptions, setDropdownOptions] = useState<Tag[]>([])
    const [selectedTags, setSelectedTags] = useState<Tag[]>(guide.tags)
    const [tagEditOpen, setTagEditOpen] = useState(false)
    const [submitted, setSubmitted] = useState(false)
    const input1Ref = useRef<HTMLInputElement>(null)
    const input2Ref = useRef<HTMLInputElement>(null)
    const input5Ref = useRef<HTMLTextAreaElement>(null)
    const modalContentRef = useRef<HTMLFormElement>(null)
    const [notAllowedTagNames, setNotAllowedTagNames] = useState<string[]>([])
    const [currentTag, setCurrentTag] = useState<Tag>()
    const [input3, setInput3] = useState(currentTag?.color ?? '#000000')
    const [tagList, setTagList] = useState<string[]>([])
    const [nameErr, setNameErr] = useState(false)
    const [colorErr, setColorErr] = useState(false)
    const [notAllowedGuideNames, setNotAllowedGuideNames] = useState<string[]>([])

    const [nameEnabled, setNameEnabled] = useState(true)
    const [colorEnabled, setColorEnabled] = useState(true)
    const [guideNameEnabled, setGuideNameEnabled] = useState(true)
    const [descEnabled, setDescEnabled] = useState(true)
    const [tagEnabled, setTagEnabled] = useState(true)

    const [guideNameErr, setGuideNameErr] = useState(false)
    const [descErr, setDescErr] = useState(false)
    const [tagErr, setTagErr] = useState(false)

    

    useEffect(() => {
        if (!tagEnabled) return
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
    }, [input2, tagEnabled])

    useEffect(() => {
        setSelectedTags(guide.tags)
    }, [guide])

    useEffect(() => {
        if ( modalOpen && modalContentRef.current ) {
            modalContentRef.current.scrollTop = 0
        }
    }, [modalOpen])

    if (setGuide === undefined) {
        console.error('setguide is undefined')
        return <div></div>
    }

    const dropdownClickHandler = ( tag : Tag ) => {
        setCurrentTag(tag)
        const exists = selectedTags.some(selectedTag => selectedTag.id === tag.id)

        if (!exists) {
            setSelectedTags([...selectedTags, tag])
        }

        setDropdownOpen(false)
    }

    const resetModal = () => {
        setInput1('')
        setInput2('')
        setInput3('#000000')
        setInput4('')
        setInput5('')
        setSelectedTags([])
        setTagList([])
        setDropdownOpen(false)
        setSubmitted(false)
        setNameEnabled(true)
        setColorEnabled(true)
        setGuideNameEnabled(true)
        setTagEnabled(true)
        setDescEnabled(true)
        setTagEditOpen(false)
        setModalOpen(false)
    }

    const resetTagEditor = () => {
        setInput3('#000000')
        setInput4('')
        setNameEnabled(true)
        setColorEnabled(true)
        setColorErr(false)
        setNameErr(false)
    } 

    const createTagHandler = async () => {
        if (input2 !== '') {
            const ids : ConnectStruct[] = []
            await fetch(`/api/tags`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    tagName: input2,
                    tagColor: input3,
                    studyGuideIDs: ids,
                })
            })
            resetTagEditor()
            setTagEditOpen(false)
            setInput2('')
        }
    }
    
    const updateTagHandler = async () => {
        if (!notAllowedTagNames.some(tagName => tagName === input4) || input4 === '') {
            const ids : ConnectStruct[] = []
            const tag = dropdownOptions.find(option => option.name === input2)
            const tagIndex = selectedTags.findIndex(option => option.name === input2)
            if (tag !== undefined) {
                let name : string

                if (nameEnabled === true) {
                    if (input4 !== '') {
                        setNameErr(false)
                        name = input4.trim()
                    } else {
                        setNameErr(true)
                        if (colorEnabled === false) {
                            setColorErr(false)
                        }
                        return
                    }
                } else {
                    setNameErr(false)
                    name = currentTag!.name
                }

                let color : string

                if (colorEnabled === true) {
                    if (input3 !== currentTag!.color) {
                        setColorErr(false)
                        color = input3
                    } else {
                        setColorErr(true)
                        return
                    }
                } else {
                    setColorErr(false)
                    color = currentTag!.color
                }

                if (name === currentTag!.name && color === currentTag!.color) {
                    return
                }

                const res = await fetch(`/api/tags`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        tagName: name,
                        tagColor: color,
                        tagID: tag.id,
                        studyGuideIDs: ids,
                    })
                })

                const updatedTag = await res.json()

                if (updatedTag.message === "Same Tag Name Error") {
                    // add debounce here and on server side 
                    // also somehow add this tag to the cache of not allowed names ykyk
                    setNotAllowedTagNames(prev => [...prev, input4])
                    setInput4('')
                    return
                }
                setSelectedTags(prev => {
                    const newSelected = [...prev]
                    console.log(tagIndex)
                    newSelected[tagIndex].name = updatedTag.name
                    newSelected[tagIndex].color = updatedTag.color
                    return newSelected
                })
                setInput2('')
            }

            resetTagEditor()
            setTagEditOpen(false)
        } else {
            setInput4('')
        }
    }

    const deleteTagHandler = async () => {
        try {
            await fetch('/api/tags', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    tagID: currentTag!.id
                })
            })

            setSelectedTags(prev => prev.filter(tag => tag.id !== currentTag!.id))
            resetTagEditor()
            setTagEditOpen(false)
            setCurrentTag(undefined)
            setInput2('')


        } catch (err) {
            console.error("An unexpected error has occurred with deleting data: ", err)
        }
    }

    const submitHandler = async (e : FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        setSubmitted(true)

        let name : string
        let description : string
        let tags : ConnectStruct[]

        if (guideNameEnabled) {
            if (notAllowedGuideNames.some(guideName => guideName === input1) || input1.trim() === '' || input1.trim() === guide.name) {
                setGuideNameErr(true)
                input1Ref.current?.focus()
                input1Ref.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
                return
            } else {
                setGuideNameErr(false)
                name = input1.trim()
            }
        } else {
            setGuideNameErr(false)
            name = guide.name
        }

        if (descEnabled) {   
            if (input5.trim() === guide.description) {
                setDescErr(true)
                input5Ref.current?.focus()
                input5Ref.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
                return
            } else {
                setDescErr(false)
                description = input5.trim()
            }
        } else {
            setDescErr(false)
            description = guide.description || ''
        }

        if (tagEnabled) {
            const tagIDs : ConnectStruct[] = []

            selectedTags.forEach((tag : Tag) => {
                tagIDs.push( {id : tag.id} )
            });

            const unique = isUnique(tagIDs, guide.tags)

            if (!unique) {
                input2Ref.current?.focus()
                input2Ref.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
                setTagErr(true)
                return
            } else {
                setTagErr(false)
                tags = tagIDs
            }

        } else {
            setTagErr(false)
            console.log('tags are guide.tags')

            tags = []

            guide.tags.forEach((tag : Tag) => {
                tags.push({ id: tag.id })
            });
        }

        if (!guideNameEnabled && !tagEnabled && !descEnabled) {
            return
        }

        console.log(name)
        console.log(typeof description)
        console.log(tags)


        const res = await fetch(`/api/studyguides?id=${guide.id}`, {
            method: 'PATCH',
            headers : {
                'Content-Type' : 'application/json',
            },
            body : JSON.stringify({
                name: name,
                description: description,
                tagIDs: tags
            })
        })

        const data = await res.json()

        if (data.message === "Same Studyguide Name Error") {
            // add debounce here and on server side 
            // also somehow add this tag to the cache of not allowed names ykyk
            setNotAllowedGuideNames(prev => [...prev, input1])
            setInput1('')
            return
        }
        setGuide(data)

        resetModal()
    }


    return (
        <div className={`root-holder outline-4 outline-offset-2 outline-purple-600 opacity-99 shadow-xl/30 fixed top-1/4 rounded-3xl bg-white ${tagEditOpen ? 'w-1/2 left-1/4' : 'w-1/3 left-1/3'} h-2/3 flex-row justify-center items-center ${ modalOpen ? 'flex' : 'hidden' }`}>
            <div className={`relative modal-wrapper flex flex-col justify-start items-start w-9/10 h-9/10 pr-4 border-purple-600 ${tagEditOpen ? 'border-r-4' : 'border-r-0'} `}>
                <h1 className="p-5 font-black text-purple-700 text-2xl self-center mt-5">Edit Study Guide</h1>
                <hr className={`${tagEditOpen ? 'w-4/5' : 'w-full'} self-center h-1 rounded-lg bg-purple-700 mb-5`}/>
                <div className="x-button cursor-pointer hover:text-2xl transition-all duration-175 ease-in-out absolute self-end top-0 font-black text-xl text-purple-700" onClick={() => {
                    resetModal()
                }}>x</div>
                <form onSubmit={submitHandler} ref={modalContentRef} className='relative modal-wrapper flex flex-col justify-self items-start w-full h-full overflow-y-scroll no-scrollbar'>
                    <div className="input-wrapper flex flex-row justify-center items-center m-5">
                        <input type='checkbox' checked={!modalOpen ? false : !guideNameEnabled} className='peer mr-2' onChange={() => {setInput1(''); setGuideNameEnabled(!guideNameEnabled)}} />
                        <h1 className="input-label text-purple-700 font-bold text-lg peer-checked:text-gray-500">Name:</h1>
                        <div className='relative flex flex-col'>
                            <input
                                value = {input1}
                                onChange = {(e) => {
                                    setInput1(e.target.value)
                                }}
                                type='text'
                                placeholder={guide.name}
                                ref={input1Ref}
                                disabled={!guideNameEnabled}
                                className= {`${guideNameEnabled ? 'focus:border-purple-700 placeholder-purple-400 hover:placeholder-purple-700 hover:bg-gray-100 focus:placeholder-purple-700' : 'border-gray-500 placeholder-gray-400 hover:placeolder-gray-400 focus:placeholder-gray-400 focus:border-gray-500'} ${(submitted === true && guideNameErr === true) ? 'border-red-500' : `${guideNameEnabled ? 'border-purple-700' : 'border-gray-500'}`} border-2 rounded-lg px-2.5 py-0.5 ml-3 transition-all duration-175 ease-in-out focus:outline-none focus:ring-0 `}
                            />
                            {guideNameErr && (
                                <p className="absolute top-full text-red-500 text-xs mt-1 ml-5">Please enter a new and valid name or deselect the field.</p>
                            )}
                        </div>
                    </div>
                    <div className="search-input-wrapper relative w-full flex flex-row justify-left items-center m-5">
                        <input type='checkbox' checked={!modalOpen ? false : !tagEnabled} className='peer mr-2' onChange={() => {setSelectedTags(guide.tags); setTagEnabled(!tagEnabled)}} />
                        <h1 className="input-label text-purple-700 font-bold text-lg text-nowrap peer-checked:text-gray-500">Tags:</h1>
                        {tagErr && (
                            <p className="absolute top-full text-red-500 text-xs mt-1 ml-5">Please enter a new set of tags or deselect the field.</p>
                        )}
                        <div className='relative w-3/8 ml-3'>
                            <input 
                                ref={input2Ref}
                                name='tagInput'
                                value = {input2}
                                onChange = {(e) => {
                                    if (!tagEditOpen) {
                                        setInput2(e.target.value)
                                    } else {
                                        // show an error saying close tag edit first :p
                                    }
                                }}
                                onFocus = {(e) => {
                                    if (!tagEditOpen) {
                                        setDropdownOpen(true)
                                    } else {
                                        setDropdownOpen(false)
                                        e.target.blur()
                                    }
                                    
                                }}
                                onBlur = {() => setTimeout(() => {setDropdownOpen(false)}, 250)}
                                type='text'
                                placeholder='Search or create tags'
                                autoComplete='off'
                                disabled={!tagEnabled}
                                className= {`${tagEnabled ? 'focus:border-purple-700 placeholder-purple-400 hover:placeholder-purple-700 hover:bg-gray-100 focus:placeholder-purple-700' : 'border-gray-500 placeholder-gray-400 hover:placeolder-gray-400 focus:placeholder-gray-400 focus:border-gray-500'} ${(submitted === true && tagErr === true) ? 'border-red-500' : `${tagEnabled ? 'border-purple-700' : 'border-gray-500'}`} border-2 rounded-lg px-2.5 py-0.5 ml-3 transition-all duration-175 ease-in-out focus:outline-none focus:ring-0 `}
                            />
                            {
                                tagEnabled ? 
                                (<div className={`dropdown-wrapper w-full ring-2 z-20 ring-inset ring-purple-600 overflow-y-scroll no-scrollbar flex-col bg-white mt-1 rounded-lg min-h-40 justify-start items-center absolute top-full right-0 ${ dropdownOpen ? 'flex' : 'hidden' }`}>
                                    <div className={`flex flex-col items-center justify-start bg-white w-full rounded-lg border-purple-600 border-2 min-h-40`}>
                                        {
                                            (input2.trim() !== "" && !tagList.includes(input2.trim())) ? (
                                                <>
                                                    <div className="createTag cursor-pointer rounded-lg sticky top-0 z-10 p-2 text-purple-700 w-full text-center hover:bg-gray-100" onClick={() => {
                                                        setTagEditOpen(true)
                                                        setInput3('#000000')
                                                    }}>Create Tag +</div>
                                                    <hr className='w-6/7 h-0.5 bg-purple-700 border-none rounded-lg' />
                                                </>
                                            ) : ""
                                        }
                                        {dropdownOptions.map(tag => (
                                            <Fragment key={tag.id}>
                                                <div className="dropdownTag cursor-pointer w-full text-center hover:bg-gray-200" onClick={() => {
                                                    dropdownClickHandler(tag)
                                                }}>{tag.name}</div>
                                                <hr className='w-6/7 h-0.5 bg-purple-700 border-none rounded-lg' />
                                            </Fragment>
                                        ))}
                                    </div>
                                </div>) : ''
                            }
                        </div>
                    </div>
                    <div className="selected-tags-wrapper flex flex-row justify-start px-5 items-center w-full">
                        {selectedTags.map(tag => (
                            <div key={`selected_${tag.id}`} className="selectedTag relative bg-purple-800 m-2 px-5 py-2 rounded-md text-white flex flex-row justify-center items-center space-evenly">
                                <h1 className={`selectedTagText font-extrabold ${tagEnabled ? 'cursor-pointer' : ' cursor-default' }`} onClick={() => {
                                    
                                    if (!tagEnabled) return
                                    setCurrentTag(tag)
                                    setInput2(tag.name)
                                    setInput3(currentTag!.color)
                                    setTagEditOpen(true)
                                    console.log(input2)
                                }}>{tag.name}</h1>
                                <div className={`selectedTagX ${tagEnabled ? 'cursor-pointer hover:text-[.7rem]' : 'cursor-default'} transition-all duration-175 ease-in-out absolute text-[.6rem] top-0 right-0 font-black m-1 mr-1.5`} onClick={() => {
                                    if (!tagEnabled) return
                                    setSelectedTags(prevItems => prevItems.filter(item => item.name !== tag.name))
                                }}>X</div>
                            </div>
                        ))}
                    </div>
                    <div className="desc-input-wrapper w-full h-full relative flex flex-col justify-start items-start m-5">
                        <div className='flex flex-row'>
                            <input type='checkbox' checked={!modalOpen ? false : !descEnabled} className='peer mr-2' onChange={() => {setInput5(''); setDescEnabled(!descEnabled)}} />
                            <h1 className="input-label text-purple-700 font-bold text-lg peer-checked:text-gray-500"  >Description:</h1>
                        </div>
                        <textarea 
                            ref={input5Ref}
                            name='descInput'
                            value = {input5}
                            onChange = {(e) => {
                                setInput5(e.target.value)
                            }}
                            placeholder={guide.description ?? ''}
                            autoComplete='off'
                            disabled={!descEnabled}
                            className={`border-2 mt-2 rounded-lg px-2.5 py-1 h-[200px] w-[90%] resize-none overflow-y-scroll no-scrollbar text-left align-top text-wrap break-words ${descEnabled ? 'focus:border-purple-700 placeholder-purple-400 hover:placeholder-purple-700 hover:bg-gray-100 focus:placeholder-purple-700' : 'border-gray-500 placeholder-gray-400 hover:placeolder-gray-400 focus:placeholder-gray-400 focus:border-gray-500'} ${(submitted === true && descErr === true) ? 'border-red-500' : `${descEnabled ? 'border-purple-700' : 'border-gray-500'}`} border-2 rounded-lg px-2.5 py-0.5 ml-3 transition-all duration-175 ease-in-out focus:outline-none focus:ring-0 `}
                        ></textarea>
                        {descErr && (
                            <p className="absolute top-full text-red-500 text-xs mt-1 ml-5">Please enter a new and valid description or deselect the field.</p>
                        )}
                    </div>
                    <div className="buttons-wrapper flex flex-row justify-end w-full items-center">
                        <button type='submit' className="bg-purple-700 p-4 rounded-xl hover:bg-purple-800 text-white transition-colors duration-175 ease-in-out font-black cursor-pointer m-5">Create Study Guide</button>
                    </div>
                </form>
            </div>
            <div className={`relative pl-4 editor-wrapper min-w-2/5 h-full flex-col justify-start items-start ${ tagEditOpen ? 'flex' : 'hidden' }`}>
                <div className="x-button m-4 mr-6 cursor-pointer hover:text-2xl transition-all duration-175 ease-in-out absolute self-end top-0 font-black text-xl text-purple-700" onClick={() => {
                    setInput2('')
                    resetTagEditor()
                    setTagEditOpen(false)
                }}>x</div>

                <h1 className='text-xl font-black text-purple-600 mt-20 mb-10'>Create or Update Tag</h1>
                <div className="tagName font-bold text-purple-600">Tag Name: <span className="text-black">{input2.trim()}</span></div>
                {
                    !tagList.includes(input2.trim()) ? (
                        <>
                            <div className="colorPicker-wrapper flex flex-row justify-start items-center">
                                <h1 className="font-bold text-purple-600 text-nowrap">Choose a Color: </h1>
                                <input
                                    value = {input3}
                                    type='color'
                                    onChange={(e) => {
                                        setInput3(e.target.value)
                                    }}
                                />
                            </div>
                            <button className='text-lg absolute right-0 bottom-0 bg-purple-700 p-2 rounded-xl hover:bg-purple-800 text-white transition-colors duration-175 ease-in-out font-black cursor-pointer m-5' onClick={createTagHandler}>Create Tag</button>
                        </>
                    ) : (
                        <>
                            <div className="relative colorPicker-wrapper flex flex-row justify-start items-center mb-8 mt-8">
                                <input type='checkbox' checked={!tagEditOpen ? false : !nameEnabled} className='peer mr-2' onChange={() => {setInput4(''); setNameEnabled(!nameEnabled)}} />
                                <h1 className="peer-checked:text-gray-500 font-bold text-purple-600 text-nowrap">Update Tag Name: </h1>
                                <input
                                    value = {input4}
                                    type='text'
                                    onChange={(e) => {
                                        setInput4(e.target.value)
                                    }}
                                    readOnly={!nameEnabled}
                                    placeholder='Enter new name...'
                                    className='peer-checked:border-gray-500 peer-checked:placeholder-gray-400 peer-checked:hover:placeholder-gray-400 peer-checked:focus:placeholder-gray-400 peer-checked:focus:border-gray-500 ml-2 mr-2 border-2 rounded-lg px-2.5 py-0.5 transition-all duration-175 w-45 ease-in-out border-purple-700 focus:border-purple-700 focus:placeholder-purple-700 focus:outline-none focus:ring-0 placeholder-purple-400 hover:placeholder-purple-700 hover:bg-gray-100'
                                />
                                {nameErr && (
                                    <p className="absolute top-full text-red-500 text-xs mt-1 ml-5">Please enter a new and valid name or deselect the field.</p>
                                )}
                            </div>
                            <div className="relative colorPicker-wrapper flex flex-row justify-start items-center">
                                <input type='checkbox' checked={!tagEditOpen ? false : !colorEnabled} className='peer mr-2' onChange={() => {setInput3(dropdownOptions.find((value) => (value.name === input2))?.color ?? '#000000'); setColorEnabled(!colorEnabled)}} />
                                <h1 className="font-bold text-purple-600 text-nowrap peer-checked:text-gray-500">Choose a Color: </h1>
                                <input
                                    value={input3}
                                    type='color'
                                    onChange={(e) => {
                                        setInput3(e.target.value)
                                    }}
                                    disabled={!colorEnabled}
                                    className="rounded-full ml-2"
                                />
                                {colorErr && (
                                    <p className="absolute top-full text-red-500 text-xs mt-1 ml-5">Please enter a new color or deselect the field.</p>
                                )}
                            </div>
                            <button className='text-lg absolute right-0 bottom-0 bg-purple-700 p-2 rounded-xl hover:bg-purple-800 text-white transition-colors duration-175 ease-in-out font-black cursor-pointer m-5' onClick={updateTagHandler}>Update Tag</button>
                            <button className='text-lg absolute left-0 bottom-0 bg-red-500 p-2 rounded-xl hover:bg-red-600 text-white transition-colors duration-175 ease-in-out font-black cursor-pointer m-5' onClick={deleteTagHandler}>Delete Tag</button>

                        </>
                    )
                }
            </div> 
        </div>
    )
}
