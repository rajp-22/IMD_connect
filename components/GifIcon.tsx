'use client';

import React, { useState, useEffect, useRef } from 'react';

interface GifIconProps {
  name: string;
  alt?: string;
  className?: string;
  size?: number;
  active?: boolean;
  groupHover?: boolean;
}

export default function GifIcon({
  name,
  alt = 'icon',
  className = 'w-6 h-6',
  size,
  active,
  groupHover = true,
}: GifIconProps) {
  const imgRef = useRef<HTMLImageElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [key, setKey] = useState<number>(0);

  const baseName = name.replace(/\.(gif|png)$/, '').replace(/-static$/, '');
  const staticSrc = `/icons/${baseName}-static.png`;
  const gifSrc = `/icons/${baseName}.gif`;

  useEffect(() => {
    if (!groupHover) return;
    const parentGroup = imgRef.current?.closest('.group');
    if (!parentGroup) return;

    const onEnter = () => {
      setKey(Date.now());
      setIsHovered(true);
    };
    const onLeave = () => {
      setIsHovered(false);
    };

    parentGroup.addEventListener('mouseenter', onEnter);
    parentGroup.addEventListener('mouseleave', onLeave);
    return () => {
      parentGroup.removeEventListener('mouseenter', onEnter);
      parentGroup.removeEventListener('mouseleave', onLeave);
    };
  }, [groupHover]);

  const isAnimating = active !== undefined ? active || isHovered : isHovered;

  const handleMouseEnter = () => {
    setKey(Date.now());
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <img
      ref={imgRef}
      src={isAnimating ? `${gifSrc}?v=${key || Date.now()}` : staticSrc}
      alt={alt}
      className={`inline-block transition-transform duration-200 select-none ${className}`}
      style={size ? { width: size, height: size } : undefined}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    />
  );
}
