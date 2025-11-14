'use client'
import React from 'react'
import Image from 'next/image'
import { assets } from '@/assets/assets'

const Logo = ({ 
  size = 48, 
  className = "" 
}) => {
  return (
    <Image 
      src={assets.logo}
      alt="GoCart Logo"
      width={size} 
      height={size}
      className={`object-contain ${className}`}
      priority={true}  // 優先載入 logo
    />
  )
}

export default Logo

