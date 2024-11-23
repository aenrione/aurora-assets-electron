import { Link, useRouterState } from "@tanstack/react-router";
import { gameStore, GameStore } from "@/lib/store";
import { XIcon } from "lucide-react";
import React from "react";
import { cn } from "@/lib/utils"
import { useToast } from "./hooks/use-toast";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { getAssetData } from "@/helpers/window_helpers";


function CurrentGameItem() {
  const currentGame = gameStore((state: GameStore) => state.currentGame)
  const { toast } = useToast()

  const getCurrentData = () => {
    console.log('Getting data for:', currentGame)
    getAssetData(currentGame).then((data) => {
      if (data) {
        toast({
          title: "Data Received",
          description: `Received data for ${currentGame.name}`,
        })
      } else {
        toast({
          title: "Data Error",
          description: `Failed to receive data for ${currentGame.name}`,
          variant: "destructive"
        })
      }
    })
  }

  if (!currentGame.name) return null
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
      className="hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground ml-5 bg-gray-200 p-1 rounded px-2"
      >
        {currentGame.name}
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Xbox ID: {currentGame.titleId}</DropdownMenuLabel>
        <DropdownMenuLabel>Aurora ID: {currentGame.databaseId}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => getCurrentData()}>
          Get Asset Data
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={() => gameStore.getState().clearCurrentGame()}
        >
        Clear
          <XIcon className="w-4 h-4 mr-2" />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default function NavigationMenuDemo() {
    const location = useRouterState({ select: (s) => s.location })
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <Link to="/">
            <NavigationMenuLink className={navigationMenuTriggerStyle()} asChild>
                <div className={location.pathname === "/" ? "font-bold" : ""}>
                    Home
                </div>
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link to="/about">
            <NavigationMenuLink className={navigationMenuTriggerStyle()} asChild>
                <div className={location.pathname === "/about" ? "font-bold" : ""}>
                    About
                </div>
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <CurrentGameItem />
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = "ListItem"

