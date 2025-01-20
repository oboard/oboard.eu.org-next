import WeixinArticle from "./[slug]/page";

export default function XHS() {
  return <WeixinArticle params={Promise.resolve({ slug: "" })} />;
}
