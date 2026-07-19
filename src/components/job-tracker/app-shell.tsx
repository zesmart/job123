"use client";

import { useState } from "react";
import { useUIStore } from "@/lib/store";
import { SidebarNav } from "./sidebar-nav";
import { MainView } from "./main-view";
import { TrashView } from "./trash-view";
import { JobEditorDialog } from "./job-editor-dialog";
import { JobDetailDialog } from "./job-detail-dialog";
import { RemoveDialog } from "./remove-dialog";
import { ThemeToggle } from "./theme-toggle";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Menu, Plus, Briefcase, Trash2 } from "lucide-react";

export function AppShell() {
  const view = useUIStore((s) => s.view);
  const openEditor = useUIStore((s) => s.openEditor);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* 顶部栏 */}
      <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-2 border-b bg-background/80 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center gap-2">
          {/* 移动端菜单按钮 */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="打开菜单"
          >
            <Menu className="h-5 w-5" />
          </Button>

          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              {view === "main" ? (
                <Briefcase className="h-4 w-4" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
            </div>
            <h1 className="text-sm font-semibold sm:text-base">
              {view === "main" ? "主界面" : "回收站"}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <ThemeToggle />
          {view === "main" && (
            <Button
              size="sm"
              className="gap-1.5"
              onClick={() => openEditor(null)}
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">新建记录</span>
              <span className="sm:hidden">新建</span>
            </Button>
          )}
        </div>
      </header>

      <div className="flex flex-1">
        {/* 桌面侧边栏 */}
        <aside className="relative z-10 hidden w-64 shrink-0 border-r bg-sidebar/40 md:block">
          <div className="sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto">
            <SidebarNav />
          </div>
        </aside>

        {/* 移动端侧边栏（Sheet） */}
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetContent side="left" className="w-72 p-0">
            <SheetHeader className="sr-only">
              <SheetTitle>导航菜单</SheetTitle>
            </SheetHeader>
            <div className="h-full overflow-y-auto">
              <SidebarNav onClose={() => setMobileOpen(false)} />
            </div>
          </SheetContent>
        </Sheet>

        {/* 主内容 */}
        <main className="flex-1 overflow-x-hidden">
          <div className="mx-auto w-full max-w-5xl px-4 py-5 sm:px-6 sm:py-6">
            {view === "main" ? <MainView /> : <TrashView />}
          </div>
        </main>
      </div>

      {/* 页脚 */}
      <footer className="mt-auto border-t bg-background/60 px-4 py-3 text-center text-[11px] text-muted-foreground">
        <span>求职记录管理 · Job Tracker</span>
        <span className="mx-1.5 text-muted-foreground/40">·</span>
        <span>个人私有 · 多设备同步</span>
      </footer>

      {/* 全局对话框 */}
      <JobEditorDialog />
      <JobDetailDialog />
      <RemoveDialog />
    </div>
  );
}
