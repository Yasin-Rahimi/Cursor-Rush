"use client";

import { Sidebar, SidebarItem, SidebarItemGroup, SidebarItems, createTheme } from "flowbite-react";
import { HiCog, HiTranslate, HiVolumeUp, HiAdjustments } from "react-icons/hi";

const customTheme = createTheme({
  root: {
    base: "h-full",
    inner: "h-full overflow-y-auto rounded bg-gray-50 px-3 py-4 dark:bg-gray-800",
    collapsed: { on: "w-16", off: "w-64" },
  },
  item: {
    base: "flex items-center rounded-lg p-2 text-base font-normal text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700",
    icon: {
      base: "h-6 w-6 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white",
    },
  },
  itemGroup: {
    base: "mt-4 space-y-2 border-t border-gray-200 pt-4 first:mt-0 first:border-t-0 first:pt-0 dark:border-gray-700",
  },
});

export default function GNGSideBar({
  lang,
  toggleLang,
  toggleMute,
  isMuted,
  handleCategoryChanged,
  handleLevelChanged,
  isOpen,
  setIsOpen
}) {
  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/40 backdrop-blur-md z-40"
        />
      )}

      {/* Sidebar */}
        <Sidebar
        theme={customTheme}
        aria-label="Game sidebar"
        className={`fixed top-0 h-full z-50 transform transition-transform duration-300 shadow-xl
        ${lang === "en" 
            ? isOpen 
            ? "translate-x-0 left-0" 
            : "-translate-x-full left-0" 
            : isOpen 
            ? "translate-x-0 right-0" 
            : "translate-x-full right-0"
        }`}
        >

        <SidebarItems className="mt-16">
          <SidebarItemGroup>
            {/* Change Category */}
            <SidebarItem
              icon={HiAdjustments}
              onClick={handleCategoryChanged}
            >
              {lang === "en" ? "Change Category" : "تغییر دسته‌بندی"}
            </SidebarItem>

            {/* Change Level */}
            <SidebarItem
              icon={HiCog}
              onClick={handleLevelChanged}
            >
              {lang === "en" ? "Change Level" : "تغییر سطح"}
            </SidebarItem>

            {/* Change Language */}
            <SidebarItem
              icon={HiTranslate}
              onClick={toggleLang}
            >
              {lang === "en" ? "فارسی" : "English"}
            </SidebarItem>

            {/* Mute / Unmute */}
            <SidebarItem
              icon={HiVolumeUp}
              onClick={toggleMute}
            >
              {isMuted
                ? (lang === "en" ? "Unmute" : "باز کردن صدا")
                : (lang === "en" ? "Mute" : "بی‌صدا")}
            </SidebarItem>
          </SidebarItemGroup>
        </SidebarItems>
      </Sidebar>
    </>
  );
}
