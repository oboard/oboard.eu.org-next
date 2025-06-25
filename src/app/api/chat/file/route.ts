// 使用http协议上传图片和读取图片
import {NextResponse} from "next/server";

const files: Map<string, Uint8Array> = new Map();

export async function GET(request: Request) {

    const { searchParams } = new URL(request.url);
    const key = searchParams.get("key") ?? "";

    const result = files.get(key);

    if (result === undefined) {
        // 如果没有找到
        return NextResponse.json({ message: "Not Found" }, {
            headers: {
                "Access-Control-Allow-Origin": "*",
            },
            status: 404,
        });
    }

    // 返回的是二进制数据
    return new Response(result.buffer as ArrayBuffer, {
        headers: {
            "Access-Control-Allow-Origin": "*",
        },
        status: 200,
    });
}

export async function POST(request: Request) {
    const body = await request.arrayBuffer();

    const key = Math.random().toString(36).substring(2);

    files.set(key, new Uint8Array(body));

    // 返回成功
    return NextResponse.json({
        message: "success",
        url: `api/chat/file?key=${key}`,
    }, {
        headers: {
            "Access-Control-Allow-Origin": "*",
        },
        status: 200,

    });
}