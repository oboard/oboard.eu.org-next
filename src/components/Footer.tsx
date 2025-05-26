import Link from "next/link";
import { motion } from "framer-motion";
import Giscus from "@giscus/react";

export default function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="flex flex-col gap-4 py-8 text-center bg-base-100 w-full pb-16 px-4 md:px-16"
    >

      <Giscus
        repo="oboard/oboard.eu.org-next"
        repoId="R_kgDOKSqEVA"
        category="Announcements"
        categoryId="DIC_kwDOKSqEVM4Cql1t"
        mapping="pathname"
        strict="0"
        reactionsEnabled="1"
        emitMetadata="0"
        inputPosition="bottom"
        theme="preferred_color_scheme"
        lang="zh-CN" />

      <p className="text-base-content/60">
        © {new Date().getFullYear()} oboard. All Rights Reserved.
      </p>
      <p className="text-base-content/60 mt-2 flex flex-col gap-2">
        <Link href="https://beian.miit.gov.cn/" target="_blank" className="hover:text-primary transition-colors">
          粤ICP备2025373229号
        </Link>
        <a className="hover:text-primary transition-colors" href="https://icp.gov.moe/?keyword=20251512" target="_blank" rel="noreferrer">萌ICP备20251512号</a>
      </p>
    </motion.footer>
  );
} 