import { NextApiRequest, NextApiResponse } from "next";
import { v4 as uuidv4 } from "uuid";
import { MessageInfo, MessageStatus } from "../../../models/chat/message";
import { NextResponse } from "next/server";

let messages: MessageInfo[] = [];

export async function GET(request: Request) {

  // 根据startTime筛选
  const { searchParams } = new URL(request.url);
  const startTime = searchParams.get("startTime");

  const result = messages.filter((item) => {
    return (item.time ?? 0) > Number(startTime);
  });

  return NextResponse.json(result, 
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      status: 200,
    });
}

export async function POST(request: Request) {
  const body = await request.json();
  // 如果是post
  // 把信息存入内存
  // body是messages
  console.log(body);
  if (!Array.isArray(body)) {
    return NextResponse.json({ message: "error" }, {
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      status: 400,
    });
  }
  messages = [...messages, ...body];
  // 要通过比对uuid来判断是否重复
  messages = messages.filter((item, index, arr) => {
    return (arr.findIndex((item2) => item2.id === item.id) === index)
  });

  // 过滤掉空信息
  messages = messages.filter((item) => {
    return item.content !== "";
  });

  messages.forEach((item) => {
    if (typeof item.time === "string" || item.time == undefined) {
      // 时间戳
      item.time = new Date().getTime();

      if (item.status == MessageStatus.Sending) {
        item.status = MessageStatus.Sent;
      }

    }
  });
  // 按照时间戳排序
  messages.sort((a, b) => {
    return (a.time ?? 0) - (b.time ?? 0);
  });

  // 保活处理
  setInterval(() => {
    messages = messages;
  }, 1000 * 60 * 60 * 24 * 7);

  // 返回成功
  return NextResponse.json({ message: "success" }, {
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    status: 200,
  });
}

// export default function handler(req: NextApiRequest, res: NextApiResponse) {
//   // 如果是get
//   if (req.method === "GET") {
//     // 返回数据
//     res
//       .status(200)
//       .setHeader("Access-Control-Allow-Origin", "*")
//       .json({
//         message: "success",
//         data:
//           messages.length > 100
//             ? messages.splice(messages.length - 100, 100)
//             : messages,
//       });
//     return;
//   } else if (req.method === "POST") {
//     // 如果是post
//     // 把信息存入内存
//     // body是messages
//     console.log(req.body);
//     messages = [...messages, ...req.body];
//     // 要通过比对uuid来判断是否重复
//     messages = messages.filter((item, index, arr) => {
//       return arr.findIndex((item2) => item2.id === item.id) === index;
//     });

//     // 过滤掉空信息
//     messages = messages.filter((item) => {
//       return item.content !== "";
//     });

//     messages.forEach((item) => {
//       if (typeof item.time === "string" || item.time == undefined) {
//         // 时间戳
//         item.time = new Date().getTime();
//       }
//     });
//     // 按照时间戳排序
//     messages.sort((a, b) => {
//       return (a.time ?? 0) - (b.time ?? 0);
//     });

//     // // 如果超过100条，删除100条之前的
//     // if (messages.length > 100) messages = messages.slice(100);
//     // 保活处理
//     setInterval(() => {
//       messages = messages;
//     }, 1000 * 60 * 60 * 24 * 7);

//     // 返回成功
//     res
//       .status(200)
//       .setHeader("Access-Control-Allow-Origin", "*")
//       .json({ message: "success" });
//   }
// }
