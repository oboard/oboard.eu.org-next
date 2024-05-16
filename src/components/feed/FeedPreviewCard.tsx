import type { FeedItemInfo } from "./FeedItemCard";
import { motion } from "framer-motion";

export default function FeedPreviewCard({ item }: { item: FeedItemInfo }) {
  return (
    item && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed bg-black bg-opacity-30 w-full h-full top-0 left-0 z-10"
      >
        <div className="card">
          <div
            className="card-body"
          />
        </div>
      </motion.div>
    )
  );
}
