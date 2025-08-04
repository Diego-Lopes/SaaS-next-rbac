import { ArrowRight } from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export function ProjectList() {
  return (
    <div className="grid grid-cols-3 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Project 01</CardTitle>
          <CardDescription className="line-clamp-2 leading-relaxed">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Harum
            suscipit, labore architecto cum quisquam cumque quod tenetur laborum
            quia, sint totam error nesciunt! Animi ratione totam expedita nemo
            at deleniti?
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex items-center gap-1.5">
          <Avatar className="size-4">
            <AvatarFallback />
            <AvatarImage src={'https://github.com/Diego-Lopes.png'} />
          </Avatar>
          <span className="text-muted-foreground text-xs">
            Created by <span className="font-medium">Diego Lopes</span> a day
            ago
          </span>

          <Button size={'xs'} variant={'outline'} className="ml-auto">
            View <ArrowRight className="ml-2 size-3" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
