// "use client";
import Image from "next/image";

export default function InterestingAvatar() {
  return (
    <div className="avatar shadow-xl rounded-full animate-wobble hover:animate-none hover:scale-110 hover:rotate-12 hover:shadow-2xl transition-all duration-500">
      <div className="w-16 rounded-full">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <Image
          // src="https://upload.jianshu.io/users/upload_avatars/8761709/3101d25e-1917-47dd-bdee-58bbda3352ac.png?imageMogr2/auto-orient/strip|imageView2/1/w/300/h/300/format/webp"
          src="https://obscloud.ulearning.cn/resources/web/1715838718885.png"
          alt={"Head"}
          className="avatar avatar-circle"
          width={256}
          height={256}
        />
      </div>
    </div>
  );
}
