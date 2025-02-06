import { useEffect } from "react";
import { useAccount } from "wagmi";
import { v7 as uuidv7 } from 'uuid';
import useLocalStorage from "./useLocalStorage";

export function useUserId() {
  const { address } = useAccount();
  const [userId, setUserId] = useLocalStorage("userId", address || uuidv7());

  // 当钱包地址改变时更新userId
  useEffect(() => {
    if (address) {
      setUserId(address);
    }
  }, [address, setUserId]);

  // 检查userId是否可用
  function checkUserIdAvalible() {
    if (userId === undefined || userId == null || userId.length < 5) {
      setUserId(uuidv7());
      // 刷新页面
      if (typeof window !== "undefined") {
        window.location.reload();
        return false;
      }
    }
    return true;
  }

  return {
    userId,
    setUserId,
    checkUserIdAvalible
  };
} 