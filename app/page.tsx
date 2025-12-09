"use client";

import { BackgroundPaths } from './(components)/background-paths';
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'



const Hero = () => {


    useGSAP(() => {

        gsap.from(".h1", {
            opacity: 0,
            duration: 4,
            ease: "slow(0.7,0.7,false)",
        })
        gsap.from(".p", {
            delay: .5,
            opacity: 0,
            duration: 4,
            ease: "slow(0.7,0.7,false)",
        })
        gsap.from(".h2 ", {
            delay: 1,
            opacity: 0,
            duration: 4,
            ease: "slow(0.7,0.7,false)",
            stagger: .3
        })

    }, [])

    return (
        <div className='h-screen w-full'>
            <BackgroundPaths title="DocExtract!" />
            
        </div>
    )
}

export default Hero
