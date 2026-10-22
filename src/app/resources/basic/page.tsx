import type { Metadata } from 'next';
import TutorialShell from '@/components/TutorialShell';
import { basicsTutorial } from '@/data/tutorials/basics';

export const metadata: Metadata = {
  title: 'Flutter 基础开发',
  description:
    'Flutter 基础开发实战：页面骨架与布局组件怎么选、ListView 列表与 setState 交互、AppBar / 底部导航 NavigationBar / TabBar 等常用界面元素配置、dio 上传下载 / mobile_scanner 扫码 / geolocator 定位 / flutter_blue_plus 蓝牙等常用第三方库速查，以及新手高频坑速查。学完直接进入工程化指南。',
};

/**
 * Flutter 基础开发（第 3 站）
 *
 * 定位：夹在「Flutter 讲解」和「工程化搭建指南」之间。
 *   讲解页告诉你框架怎么思考；这一站告诉你页面怎么写出来 ——
 *   界面编写、常用界面元素配置（TabBar / 底部导航等）、
 *   基础能力对应的第三方库（蓝牙 / 定位 / 文件 / 扫码）、新手补遗。
 *   组件手册保留在 /components 作随用随查的字典。
 *
 * 4 章 · 15 节：界面编写 → 常用配置 → 第三方库 → 补遗与衔接工程化。
 */
export default function BasicsPage() {
  return (
    <>
      <TutorialShell
        eyebrow="第 3 步 · 上手开发"
        title="Flutter 基础开发"
        intro={
          <>
            框架的心智模型有了，这一站教你<b className="font-semibold text-ink-800">把页面真正写出来</b>：
            基本界面的编写方法、AppBar / 底部导航 / TabBar 这些常用界面元素的配置，
            以及蓝牙、定位、文件上传下载、扫码等基础能力对应的第三方库用法。
            学完就能写出一个像样的多页 App，直接衔接第四步的工程化搭建。
          </>
        }
        chapters={basicsTutorial}
        siblings={{
          prev: { href: '/resources/flutter', label: 'Flutter 讲解' },
          next: { href: '/handbook', label: '工程化搭建指南' },
        }}
      />

      <div className="mx-auto max-w-page px-4 pb-4 sm:px-6">
        <div className="flex flex-col gap-3 rounded-xl border border-ink-100 bg-surface p-5 sm:flex-row sm:items-center">
          <div className="min-w-0 flex-1">
            <p className="text-[14px] font-medium text-ink-400">随用随查</p>
            <p className="mt-1 text-[18px] font-semibold text-ink-900">
              某个组件长什么样？属性怎么传？
            </p>
            <p className="mt-1 text-[15.5px] leading-relaxed text-ink-600">
              组件手册保留在「组件」栏目：67 个高频组件、134 个图形示例、属性速查与避坑，
              当字典用，不用整本读。
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
