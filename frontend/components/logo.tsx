import { MessageSquare } from "lucide-react"

interface LogoProps {
  className?: string
}

export function Logo({ className }: LogoProps) {
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <MessageSquare className="h-6 w-6 text-primary" />
      <span className="font-bold text-xl">CitizenConnect</span>
    </div>
  )
}
