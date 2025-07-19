'use client'

import { Button } from '@/components/ui/button'
import { ArrowLeft, Settings } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface TopNavProps {
  title: string
  showBack?: boolean
  showSettings?: boolean
  onBack?: () => void
}

export function TopNav({ title, showBack = false, showSettings = true, onBack }: TopNavProps) {
  const router = useRouter()

  const handleBack = () => {
    if (onBack) {
      onBack()
    } else {
      router.back()
    }
  }

  return (
    <div className="bg-primary text-primary-foreground p-4">
      <div className="flex items-center justify-between">
        {showBack ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className="text-primary-foreground hover:bg-primary/80"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        ) : (
          <div className="w-10" />
        )}
        
        <h1 className="text-lg font-semibold">{title}</h1>
        
        {showSettings ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push('/config')}
            className="text-primary-foreground hover:bg-primary/80"
          >
            <Settings className="h-5 w-5" />
          </Button>
        ) : (
          <div className="w-10" />
        )}
      </div>
    </div>
  )
} 