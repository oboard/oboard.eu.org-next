import XHSArticle from "./[slug]/page";

export default function XHS() {
  return <XHSArticle params={Promise.resolve({ slug: "" })} />;
}
