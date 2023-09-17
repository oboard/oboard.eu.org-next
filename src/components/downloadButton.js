"use client";
export const downloadFile = (link, fileName) => {
    const a = document.createElement("a");
    a.href = link;
    a.download = fileName;
    a.click();
};

var downloadIamge = function(imgsrc, name) { //下载图片地址和图片名
    let image = new Image();
    // 解决跨域 Canvas 污染问题
    image.setAttribute("crossOrigin", "anonymous");
    image.onload = function() {
        let canvas = document.createElement("canvas");
        canvas.width = image.width;
        canvas.height = image.height;
        let context = canvas.getContext("2d");
        context.drawImage(image, 0, 0, image.width, image.height);
        let url = canvas.toDataURL("image/png"); //得到图片的base64编码数据
        let a = document.createElement("a"); // 生成一个a元素
        let event = new MouseEvent("click"); // 创建一个单击事件
        a.download = name || "photo"; // 设置图片名称
        a.href = url; // 将生成的URL设置为a.href属性
        a.dispatchEvent(event); // 触发a的单击事件
    };
    image.src = "/_next/image?url=" +  encodeURIComponent(imgsrc) + "&w=1080&q=75"
}

export default function DownloadButton(props) {
  return (
    <button
      className={`btn btn-primary ${props.className}`}
      onClick={() => {
        downloadIamge(props.link, props.name);
      }}
    >
      下载
    </button>
  );
}
