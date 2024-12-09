import { Metadata } from "next"
import { Toaster } from "@repo/ui/components/toaster"
import { Separator } from "@repo/ui/components/separator"
import { SidebarNav } from "@repo/ui/components/side-nav"

export const metadata: Metadata = {
  title: "settings",
}

const sidebarNavItems = [
  {
    title: "Profile",
    href: "/settings",
  },
  {
    title: "friends",
    href: "/account/info",
  }
]

interface SettingsLayoutProps {
  children: React.ReactNode
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  return (
    <>
      <div className=" space-y-6 p-10 pb-16 md:block h-[90%]">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
        </div>
        <Separator className="my-2" />
        <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
          <aside className="-mx-4 lg:w-1/5">
            <SidebarNav items={sidebarNavItems} />
          </aside>
          <div className="flex-1 lg:max-w-2xl">{children}</div>
          <Toaster />
        </div>
      </div>
    </>
  )
}