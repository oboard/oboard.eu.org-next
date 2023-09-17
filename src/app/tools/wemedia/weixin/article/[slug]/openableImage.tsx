"use client";

import Image from "next/image";

export default function OpenableImage({ src, data }: any) {
  return (
    <Image
      src={src}
      alt={data["og:title"]}
      layout="responsive"
      sizes="100vw"
      width={100}
      height={100}
      className="shadow-lg hover:shadow-xl transform hover:scale-105 transition duration-500"
      onClick={() => {
        window.open(src);
      }}
    />
  );
}
