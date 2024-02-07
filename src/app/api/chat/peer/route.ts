import { MessageInfo, MessageStatus } from "@/models/chat/message";
import { NextResponse } from "next/server";

let users: string[] = [];

export async function GET(request: Request) {
  return NextResponse.json(users, {
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    status: 200,
  });
}

export async function POST(request: Request) {
  const userId = await request.text();

  if (!users.includes(userId) && userId !== "") {
    users = [...users, userId];
  }

  // 返回的是一个数组
  return NextResponse.json(users, {
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    status: 200,
  });
}
