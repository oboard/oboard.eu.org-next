export async function GET(request: Request, response: Response) {
    const { searchParams } = new URL(request.url);
    const prompt = searchParams.get("prompt");
    const userId = searchParams.get("userId");

    const headers = {
        'Content-Type': 'application/json',
        'Host': 'api.binjie.fun',
        'Origin': 'https://chat18.aichatos.xyz'
    };
    const payload = {
        "prompt": prompt,
        "userId": "#/chat/" + userId,
        "network": true,
        "system": "",
        "withoutContext": false,
        "stream": false
    }
    const res = await fetch('https://api.binjie.fun/api/generateStream', {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(payload),
    });
    // 替换binjie为ChatGPT
    // const text = (await res.text()).replace(/binjie/g, 'ChatGPT');
    // return new Response(, {
    //     headers: {
    //         "Access-Control-Allow-Origin": "*",
    //     },
    //     status: 200,
    // });

    // 以流的形式返回
    return new Response(res.body, {
        headers: {
            "Access-Control-Allow-Origin": "*",
        },
        status: 200,
    });
}