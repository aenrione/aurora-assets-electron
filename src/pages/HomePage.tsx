import React from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import FTPAssets from "./Assets/FTPAssets"
import OnlineAssets from "./Assets/OnlineAssets"
import ScreenshotsContent from "./Assets/Screenshots"
import CoverContent from "./Assets/Cover"
import BackgroundContent from "./Assets/Background"
import IconBannerContent from "./Assets/Icon"

function Home() {
  return (
    <div className="container p-4">
      <Tabs defaultValue="boxart">
        <TabsList>
          <TabsTrigger value="boxart">Boxart/Cover</TabsTrigger>
          <TabsTrigger value="background">Background</TabsTrigger>
          <TabsTrigger value="icon">Icon/Banner</TabsTrigger>
          <TabsTrigger value="screenshots">Screenshots</TabsTrigger>
          <TabsTrigger value="online">Online Assets</TabsTrigger>
          <TabsTrigger value="ftp">FTP Assets</TabsTrigger>
        </TabsList>

        <TabsContent value="ftp" className="space-y-4">
            <FTPAssets />
        </TabsContent>

        <TabsContent value="online" className="space-y-4">
            <OnlineAssets />
        </TabsContent>

        <TabsContent value="screenshots" className="space-y-4">
            <ScreenshotsContent />
        </TabsContent>

        <TabsContent value="boxart" className="space-y-4">
            <CoverContent />
        </TabsContent>

        <TabsContent value="background" className="space-y-4">
            <BackgroundContent />
        </TabsContent>

        <TabsContent value="icon" className="space-y-4">
            <IconBannerContent />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default Home
