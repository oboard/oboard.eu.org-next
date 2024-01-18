
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  // 如果是post
  // 把信息存入内存
  // body是messages
  console.log(body);

  // 返回成功
  return NextResponse.json({ message: "登陆成功" }, {
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    status: 200,
  });
}