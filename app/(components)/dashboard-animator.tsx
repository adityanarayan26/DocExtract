'use client'

import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'

export default function DashboardAnimator({ children }: { children: React.ReactNode }) {
  const containerRef = useRef(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Animate Header & Title
      gsap.from("[data-animate='header']", {
        y: -20,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out"
      })

      // Animate Stats Cards
      gsap.from("[data-animate='card']", {
        y: 20,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: "power3.out",
        delay: 0.2
      })

      // Animate Table Rows
      gsap.from("[data-animate='row']", {
        y: 10,
        opacity: 0,
        duration: 0.5,
        stagger: 0.05,
        ease: "power2.out",
        delay: 0.5
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return <div ref={containerRef}>{children}</div>
}