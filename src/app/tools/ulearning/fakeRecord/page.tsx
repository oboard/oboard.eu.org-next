import React, { PropsWithChildren } from "react";
import style from "./styles.module.scss";
// import clsx from 'clsx'
import Link from "next/link";
import Image from "next/image";

export default function FakeRecord() {
  return (
    <div className={"py-24 px-4"}>
      
        <input className="w-full input input-bordered" placeholder="输入UID"></input>
        <textarea className="w-full h-96 textarea textarea-bordered" placeholder="输入题目"></textarea>
        <button className="btn btn-primary">转换 ⬇</button>
        <textarea className="w-full h-96 textarea textarea-bordered" placeholder="failureRecord" disabled></textarea>

      
    </div>
  );
}
