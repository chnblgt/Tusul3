import { useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";


export default function Index() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/page");
  }, []);
  return null;
}