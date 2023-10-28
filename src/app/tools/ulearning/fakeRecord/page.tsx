"use client";

import React from "react";
import useLocalStorage from "@/hooks/useLocalStorage";
import toast from "react-hot-toast";

export default function FakeRecord() {
  const [uid, setUid] = useLocalStorage("fakeRecord-uid", "");
  const [content, setContent] = useLocalStorage("fakeRecord-content", "");
  const [failureRecord, setFailureRecord] = useLocalStorage(
    "fakeRecord-failureRecord",
    ""
  );

  const convert = () => {
    let obj: any = {};
    if (content === "" || content === undefined || content === null || content.length === 0) {
      toast.error("请输入内容");
      return;
    }
    if (uid === "" || uid === undefined || uid === null || uid.length === 0) {
      toast.error("请输入UID");
      return;
    }

    const data = JSON.parse(content);
    data.chapters.forEach((item: any) => {
      item.items.forEach((item1: any) => {
        obj[item1.itemid] = {
          name: item1.title,
          param: "?courseType=4&platform=PC",
          record: {
            itemid: item1.itemid,
            autoSave: 0,
            withoutOld: null,
            complete: 1,
            studyStartTime: 1699512379,
            score: 100,
            pageStudyRecordDTOList: item1.coursepages.map((item2: any) => {
              return {
                pageid: item2.relationid,
                complete: 1,
                studyTime: 22361,
                score: 100,
                answerTime: 1,
                submitTimes: 0,
                questions: [],
                videos: [],
                speaks: [],
              };
            }),
          },
        };
      });
    });

    setFailureRecord(
      JSON.stringify({
        11735745: obj,
      })
    );
  };

  return (
    <div className={"py-24 px-4 flex flex-col items-center gap-4 w-full"}>
      <h1 className="text-4xl">优学院学习记录转换助手</h1>
      <button className="btn btn-primary w-full" onClick={convert}>
        转换
      </button>

      <div className={"flex md:flex-row flex-col gap-4 w-full"}>
        <div className="flex flex-col gap-2">
          <input
            className="w-full input input-bordered"
            placeholder="输入UID"
            value={uid}
            onChange={(e) => setUid(e.target.value)}
          ></input>
          <textarea
            className="w-full md:h-0 md:flex-1 h-96 textarea textarea-bordered"
            placeholder="输入courseList"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          ></textarea>
        </div>
        <textarea
          className="w-full h-96 textarea textarea-bordered"
          placeholder="failureRecord"
          // 不可编辑
          readOnly
          value={failureRecord}
        ></textarea>
      </div>
    </div>
  );
}
