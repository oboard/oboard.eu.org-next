"use client";

import toast from "react-hot-toast";

export default function copyer({ body, children }: { body: string, children?: React.ReactNode }) {
  return (
    <button
      className="btn btn-primary"
      onClick={() => {
        navigator.clipboard.writeText(body);
        toast.success("复制成功");
      }}
    >
      {children || "复制"}
    </button>
  );
}
