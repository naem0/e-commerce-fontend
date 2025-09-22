'use client'

import { useIsMobile } from '@/hooks/use-mobile'
import SupportButton from './support-button'
import MobileBottomNav from './mobile-bottom-nav'

export function ConditionalNav() {
  const isMobile = useIsMobile()

  return isMobile ? <MobileBottomNav /> : <SupportButton />
}
