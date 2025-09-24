"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import type { StaticImageData } from "next/image";
import unknownImg from "@/assets/question-mark.svg";

// Todo
// Extend image props
interface Props {
  src: string | StaticImageData | null;
  alt: string;
  width?: number | `${number}` | undefined;
  height?: number | `${number}` | undefined;
  fill?: boolean | undefined;
  quality?: number | `${number}` | undefined;
  priority?: boolean | undefined;
  loading?: "eager" | "lazy" | undefined;
  blurDataURL?: string | undefined;
  unoptimized?: boolean | undefined;
  overrideSrc?: string | undefined;
  layout?: string | undefined;
  objectFit?: string | undefined;
  objectPosition?: string | undefined;
  lazyBoundary?: string | undefined;
  lazyRoot?: string | undefined;
  className?: string | undefined;
  fallbackImageUrl?: string | StaticImageData;
  avatar?: {
    styles?: string;
    letter?: string;
    letterStyles?: string;
  };
}

const ImageWithFallback = (props: Props) => {
  let { fallbackImageUrl } = props;
  const { src, ...rest } = props;
  const [imgSrc, setImgSrc] = useState<
    string | StaticImageData | undefined | null
  >(undefined);
  useEffect(() => {
    setImgSrc(src);
  }, [src]);
  const imgProps = { ...rest };
  fallbackImageUrl = unknownImg as string | StaticImageData;

  useEffect(() => {
    if (!imgSrc && !src) {
      setImgSrc(fallbackImageUrl);
    }
  }, [fallbackImageUrl, imgSrc, src]);
  if ((!src || imgSrc === fallbackImageUrl) && props.avatar) {
    return (
      <div
        {...rest}
        className={
          "rounded-full flex  items-center justify-center border-primary-400 text-[14px] leading-[14px] border bg-primary-400/20" +
          props.avatar.styles
        }
      >
        <span className={" " + props.avatar.letterStyles}>
          {props.avatar.letter}
        </span>
      </div>
    );
  }

  delete imgProps.fallbackImageUrl;
  delete imgProps.avatar;
  if (imgSrc) {
    return (
      // eslint-disable-next-line jsx-a11y/alt-text
      <Image
        {...rest}
        src={imgSrc ?? "ah dog"}
        onError={() => {
          setImgSrc(fallbackImageUrl);
        }}
      />
    );
  }
  if (!src) {
    return;
  }
  return (
    // eslint-disable-next-line jsx-a11y/alt-text
    <Image
      {...rest}
      src={src ?? "url"}
      onError={() => {
        setImgSrc(fallbackImageUrl);
      }}
    />
  );
};

export default ImageWithFallback;
