import Link from "next/link";
import { motion } from "framer-motion";

export default function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="py-8 text-center bg-base-100"
    >
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