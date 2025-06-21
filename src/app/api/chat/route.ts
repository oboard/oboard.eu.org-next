import { MessageInfo, MessageStatus } from '../../../models/chat/message';
import { NextResponse } from 'next/server';

const messages: MessageInfo[] = [];
const sseConnections: Set<ReadableStreamDefaultController> = new Set();

export async function GET(request: Request) {
  // 检查是否是 SSE 请求
  const { searchParams } = new URL(request.url);
  const isSSE = searchParams.get('sse') === 'true';
  const startTime = searchParams.get('startTime');

  if (isSSE) {
    // 返回 SSE 流
    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      start(controller) {
        // 发送初始连接消息
        controller.enqueue(encoder.encode('data: connected\n\n'));

        // 将控制器添加到连接集合中
        sseConnections.add(controller);

        // 立即发送当前已有的新消息
        const currentMessages = messages.filter((item) => {
          return (item.time ?? 0) > Number(startTime || 0);
        });

        if (currentMessages.length > 0) {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(currentMessages)}\n\n`));
        }
      },
      cancel(controller) {
        // 当流被取消时，从连接集合中移除
        sseConnections.delete(controller);
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Cache-Control',
      },
    });
  }

  // 普通 GET 请求
  const result = messages.filter((item) => {
    return (item.time ?? 0) > Number(startTime);
  });

  return NextResponse.json(result, {
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    status: 200,
  });
}

// 广播新消息到所有 SSE 连接
function broadcastNewMessages(newMessages: MessageInfo[]) {
  if (sseConnections.size === 0 || newMessages.length === 0) return;

  const encoder = new TextEncoder();
  const data = encoder.encode(`data: ${JSON.stringify(newMessages)}\n\n`);

  sseConnections.forEach((controller) => {
    try {
      controller.enqueue(data);
    } catch (error) {
      // 如果发送失败，从连接集合中移除
      sseConnections.delete(controller);
    }
  });
}

export async function POST(request: Request) {
  const body = await request.json();
  // 如果是post
  // 把信息存入内存
  // body是messages
  console.log(body);
  if (!Array.isArray(body)) {
    return NextResponse.json(
      { message: 'error' },
      {
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
        status: 400,
      }
    );
  }

  const newMessages = [...body];
  messages.push(...newMessages);

  // 要通过比对uuid来判断是否重复
  const uniqueMessages = messages.filter((item, index, arr) => {
    return arr.findIndex((item2) => item2.id === item.id) === index;
  });

  // 清空并重新填充数组
  messages.length = 0;
  messages.push(...uniqueMessages);

  // 过滤掉空信息
  const filteredMessages = messages.filter((item) => {
    return item.content !== '';
  });

  // 清空并重新填充数组
  messages.length = 0;
  messages.push(...filteredMessages);

  messages.forEach((item) => {
    if (typeof item.time === 'string' || item.time === undefined) {
      // 时间戳
      item.time = new Date().getTime();

      if (item.status === MessageStatus.Sending) {
        item.status = MessageStatus.Sent;
      }
    }
  });

  // 按照时间戳排序
  messages.sort((a, b) => {
    return (a.time ?? 0) - (b.time ?? 0);
  });

  // 广播新消息到所有 SSE 连接
  broadcastNewMessages(newMessages);

  // 返回成功
  return NextResponse.json(
    { message: 'success' },
    {
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      status: 200,
    }
  );
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
