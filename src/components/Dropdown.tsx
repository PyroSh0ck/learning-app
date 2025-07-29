'use client'

import { DDConfig, ListOption } from "@/lib/customTypes";
import { ReactNode } from "react";
import { isTag } from "@/lib/prismaTypes";
import { Tag } from "@prisma/client";



function Container({ children, config, visible } : { children : ReactNode, config : DDConfig, visible : boolean }) {
    return (
        <div className={`absolute top-full mt-1.5 transition-all duration-175 ease-in-out flex-col ${ visible ? 'flex' : 'hidden'} ${config.backgroundColor} ${config.fontWeight} ${config.height} ${config.width} ${config.textColor} ${config.fontSize}`}>
            { children }
        </div>
    )
}

function Header({ config } : { config: DDConfig }) {
    if (config.header) {
        return (
            <div onClick={() => {
                if (config.headerClick) {
                    config.headerClick()
                }
            }}>

            </div>
        )
    } else {
        return <div></div>
    }
}

function Body({ options, onClick, config } : { options : ListOption[], onClick : ( value : unknown ) => void, config : DDConfig }) {
    return (
        <>
            {options.map(option => {
                if (isTag(option.value)) {
                    const tag : Tag = option.value
                    return (
                        <div 
                            onClick={() => {onClick(tag)}} 
                            key={option.value.id}
                            className={`${config.hover}`}
                        >
                                
                            {option.label}
                            
                        </div>
                    )
                }
            })}
        </>
    )
}

function Footer({ config } : { config: DDConfig }) {
    if (config.footer) {
        return (
            <div onClick={() => {
                if (config.footerClick) {
                    config.footerClick()
                }
            }}>

            </div>
        )
    } else {
        return <div></div>
    }
    
}
export default function Dropdown({ options, onClick, config, visible } : { options : ListOption[], onClick : (value : unknown) => void, config: DDConfig, visible : boolean })  {
    return (
        <Container config={config} visible={visible} >
            <Header config={config} />
            <Body options={options} onClick={onClick} config={config} />
            <Footer config={config} />
        </Container>
    )
}
