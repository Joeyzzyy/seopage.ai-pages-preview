import { redirect } from 'next/navigation';

export default function RootPage() {
  // 默认重定向到英文首页
  redirect('/en/home');
}