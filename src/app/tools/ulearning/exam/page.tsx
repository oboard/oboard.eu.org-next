"use client";
import useLocalStorage from "@/hooks/useLocalStorage";
import { ExamItem } from "@/models/ulearning/examItem";
import { useState } from "react";

export default function Home() {
  const [authorization, setAuthorization] = useLocalStorage(
    "ulearning_authorization",
    ""
  );

  const [list, setList] = useLocalStorage("ulearning_list", []);
  const [selectedExamItem, setSelectedExamItem] = useState<ExamItem>();

  const config: any = {
    headers: {
      Accept: "application/json, text/javascript, */*; q=0.01",
      "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
      Authorization: authorization,
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
      "Content-Type": "application/json",
      Origin: "https://utest.ulearning.cn",
      Pragma: "no-cache",
      Referer: "https://utest.ulearning.cn/uExam/?type=1",
      "Sec-Fetch-Dest": "empty",
      "Sec-Fetch-Mode": "cors",
      "Sec-Fetch-Site": "same-site",
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
    },
    referrer: "https://utest.ulearning.cn/index.html?v=1686750539947",
    referrerPolicy: "strict-origin-when-cross-origin",
    body: null,
    method: "GET",
    mode: "cors",
    credentials: "include",
  };

  const fetchList = async () => {
    const listResponse = await fetch(
      `/utestapi/exams/learner/examListFormOrgan1?intPage=1&lang=zh`,
      config
    );
    const l = (await listResponse.json()).result.examList as ExamItem[];
    setList(l);
  };

  const showPaperDialog = (item: ExamItem) => {
    const modal = document?.getElementById("my_modal_1") as HTMLDialogElement;
    modal?.showModal();

    setSelectedExamItem(item);
  };

  const exportPaper = (examItem: ExamItem, paperID: string) => async () => {
    const listResponse = await fetch(
      `/utestapi/exams/user/study/getPaperForStudent?paperId=${paperID}&examId=${examItem.examID}`,
      config
    );
  };



  return (
    <main className={"py-24 px-4 flex flex-col items-center gap-4 w-full"}>
      <div className="text-2xl font-bold text-center">
        优学院试卷导出助手
        <br />
        <span className="text-sm font-normal">一键导出优学院试卷</span>
      </div>

      {/* 表单 */}
      <div className="flex flex-col items-center justify-center space-y-4 py-4">
        {/* Authorization: */}
        <input
          className="w-64 p-2 border border-gray-300 rounded-md"
          value={authorization}
          onChange={(e) => {
            setAuthorization(e.target.value);
          }}
          placeholder="请输入优学院Cookie"
        />
        <button className="w-64 btn" onClick={fetchList}>
          获取考试列表
        </button>
      </div>

      {/* 列表展示 */}
      <div>
        <table className="table table-xs">
          <thead>
            <tr>
              <th>序号</th>
              <th>考试名称</th>
              <th>考试时间</th>
              <th>结束时间</th>
              <th>考试状态</th>
              <th>试卷份数</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {list.map((item: ExamItem, index: number) => (
              <tr key={item.examID}>
                <td>{index + 1}</td>
                <td>{item.title}</td>
                <td>{item.examTime}</td>
                <td>{item.endTime}</td>
                <td>{item.currentState}</td>
                <td>{item.paperID.split(";").length - 2}</td>
                <td>
                  <button className="btn btn-xs" onClick={() => showPaperDialog(item)}>
                    导出
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <dialog id="my_modal_1" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Hello!</h3>
          <p className="py-4">
            <table className="table table-xs">
              <thead>
                <tr>
                  <th>序号</th>
                  <th>试卷ID</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                {selectedExamItem?.paperID.split(";").map((item: string, index: number) => (item)?(
                  <tr key={item}>
                    <td>{index + 1}</td>
                    <td>{item}</td>
                    <td>
                      <form method="dialog">
                        <button className="btn btn-xs" onClick={exportPaper(selectedExamItem,item)}>导出</button>
                      </form>
                    </td>
                  </tr>
                ):null)}
              </tbody>
            </table>
          </p>
          <div className="modal-action">
            <form method="dialog">
              <button className="btn">关闭</button>
            </form>
          </div>
        </div>
      </dialog>

      
      <dialog id="my_modal_2" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Hello!</h3>
          <p className="py-4">
            <table className="table table-xs">
              <thead>
                <tr>
                  <th>序号</th>
                  <th>试卷ID</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                {selectedExamItem?.paperID.split(";").map((item: string, index: number) => (item)?(
                  <tr key={item}>
                    <td>{index + 1}</td>
                    <td>{item}</td>
                    <td>
                      <form method="dialog">
                        <button className="btn btn-xs" onClick={exportPaper(item)}>导出</button>
                      </form>
                    </td>
                  </tr>
                ):null)}
              </tbody>
            </table>
          </p>
          <div className="modal-action">
            <form method="dialog">
              <button className="btn">关闭</button>
            </form>
          </div>
        </div>
      </dialog>
    </main>
  );
}
