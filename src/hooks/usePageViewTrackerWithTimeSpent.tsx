// hooks/usePageViewTrackerWithTimeSpent.ts
import { supabase } from '@/integrations/supabase/client'
import { useEffect, useRef, useCallback } from 'react'

interface TrackPageViewParams {
  entityType: 'facility' | 'medical_professional'
  entityId: string
  userId?: string
  trackTimeSpent?: boolean
  minTimeToTrack?: number // Minimum time in seconds before tracking
}

class PageViewTrackerWithTimeSpent {
  private visitorId: string | null = null
  private sessionId: string | null = null
  private startTimes: Map<string, number> = new Map()
  private viewIds: Map<string, string> = new Map()
  private visibilityTimers: Map<string, NodeJS.Timeout> = new Map()
  private isPageVisible: boolean = true

  constructor() {
    this.initVisitorId()
    this.initSessionId()
    this.setupVisibilityListeners()
  }

  private initVisitorId() {
    if (typeof window === 'undefined') return
    
    let id = localStorage.getItem('visitor_id')
    if (!id) {
      id = crypto.randomUUID()
      localStorage.setItem('visitor_id', id)
    }
    this.visitorId = id
  }

  private initSessionId() {
    if (typeof window === 'undefined') return
    
    let id = sessionStorage.getItem('session_id')
    if (!id) {
      id = crypto.randomUUID()
      sessionStorage.setItem('session_id', id)
    }
    this.sessionId = id
  }

  private setupVisibilityListeners() {
    if (typeof document === 'undefined') return
    
    document.addEventListener('visibilitychange', () => {
      this.isPageVisible = !document.hidden
      
      // Resume or pause time tracking based on visibility
      this.viewIds.forEach((viewId, key) => {
        if (this.isPageVisible) {
          // Resume tracking
          const [entityType, entityId] = key.split(':')
          this.startTrackingTime(entityType as any, entityId, viewId)
        } else {
          // Pause tracking - record current time spent so far
          const [entityType, entityId] = key.split(':')
          this.pauseTimeTracking(entityType as any, entityId, viewId)
        }
      })
    })
  }

  private getDeviceType(): 'mobile' | 'desktop' | 'tablet' {
    if (typeof window === 'undefined') return 'desktop'
    
    const ua = navigator.userAgent
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobile))/i.test(ua)) {
      return 'tablet'
    }
    if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
      return 'mobile'
    }
    return 'desktop'
  }

//   async trackView(
//     entityType: 'facility' | 'medical_professional',
//     entityId: string,
//     userId?: string,
//     trackTimeSpent: boolean = true
//   ): Promise<string> {
//     if (!this.visitorId) return ''

//     const viewKey = `${entityType}:${entityId}`
//     const viewId = crypto.randomUUID()
    
//     try {
// //         const { data } = await supabase.auth.getSession()
// // const token = data.session?.access_token
// //       const response = await fetch(
// //         `https://mnthjabxkmgmbuquefyy.supabase.co/functions/v1/track-page-view`,
// //         {
// //           method: 'POST',
// //           headers: {
// //             'Content-Type': 'application/json',
// //             'Authorization': `Bearer ${token}`
// //           },
// //           body: JSON.stringify({
// //             entity_type: entityType,
// //             entity_id: entityId,
// //             device_type: this.getDeviceType(),
// //             visitor_id: this.visitorId,
// //             session_id: this.sessionId,
// //             user_id: userId,
// //             referrer_url: document.referrer,
// //             user_agent: navigator.userAgent,
// //             view_id: viewId
// //           })
// //         }
// //       )

// if (!userId){
//   const  token =import.meta.env.VITE_SUPABASE_ANON_KEY

// }else {
// const { data } = await supabase.auth.getSession()
// const token = data.session?.access_token
// }

// const headers: Record<string, string> = {
//   "Content-Type": "application/json",
// }

// // ✅ Only attach token if exists
// if (token) {
//   headers["Authorization"] = `Bearer ${token}`
// }

// const response = await fetch(
//   `https://mnthjabxkmgmbuquefyy.supabase.co/functions/v1/track-page-view`,
//   {
//     method: "POST",
//     headers,
//     body: JSON.stringify({
//       entity_type: entityType,
//       entity_id: entityId,
//       device_type: this.getDeviceType(),
//       visitor_id: this.visitorId,
//       session_id: this.sessionId,
//       user_id: userId,
//       referrer_url: document.referrer,
//       user_agent: navigator.userAgent,
//       view_id: viewId,
//     }),
//   }
// )

//       if (response.ok) {
//         this.viewIds.set(viewKey, viewId)
        
//         if (trackTimeSpent) {
//           this.startTrackingTime(entityType, entityId, viewId)
//         }
        
//         return viewId
//       }
//     } catch (error) {
//       console.error('Error tracking page view:', error)
//     }
    
//     return ''
//   }
async trackView(
  entityType: 'facility' | 'medical_professional',
  entityId: string,
  userId?: string,
  trackTimeSpent: boolean = true
): Promise<string> {
  if (!this.visitorId) return '';

  const viewKey = `${entityType}:${entityId}`;
  const viewId = crypto.randomUUID();

  try {
    let token: string | null = null;
    let useAnonKey = false;

    // Determine token based on whether user is logged in
    if (userId) {
      // User is logged in – get session token
      const { data } = await supabase.auth.getSession();
      token = data.session?.access_token || null;
      if (!token) {
        console.warn('User ID provided but no active session');
        // Fallback to anon key if no session (optional)
        useAnonKey = true;
      }
    } else {
      // Anonymous user – use anon key (or no auth header)
      useAnonKey = true;
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    } else if (useAnonKey) {
      // If you want to send an anon key (if your edge function allows public access)
      headers['apikey'] = import.meta.env.VITE_SUPABASE_ANON_KEY;
      // Or keep empty – depends on your edge function's auth requirements
    }

    const response = await fetch(
      'https://mnthjabxkmgmbuquefyy.supabase.co/functions/v1/track-page-view',
      {
        method: 'POST',
        headers,
        body: JSON.stringify({
          entity_type: entityType,
          entity_id: entityId,
          device_type: this.getDeviceType(),
          visitor_id: this.visitorId,
          session_id: this.sessionId,
          user_id: userId,
          referrer_url: document.referrer,
          user_agent: navigator.userAgent,
          view_id: viewId,
        }),
      }
    );

    if (response.ok) {
      this.viewIds.set(viewKey, viewId);
      if (trackTimeSpent) {
        this.startTrackingTime(entityType, entityId, viewId);
      }
      return viewId;
    } else {
      console.error('Track view failed:', response.status, await response.text());
    }
  } catch (error) {
    console.error('Error tracking page view:', error);
  }

  return '';
}
  private startTrackingTime(
    entityType: 'facility' | 'medical_professional',
    entityId: string,
    viewId: string
  ) {
    const viewKey = `${entityType}:${entityId}`
    
    // Clear any existing timer
    if (this.visibilityTimers.has(viewKey)) {
      clearInterval(this.visibilityTimers.get(viewKey))
    }
    
    // Start time tracking
    this.startTimes.set(viewKey, Date.now())
    
    // Set up interval to update time spent every 5 seconds while page is visible
    const timer = setInterval(() => {
      if (this.isPageVisible && this.startTimes.has(viewKey)) {
        const startTime = this.startTimes.get(viewKey)!
        const currentTimeSpent = Math.floor((Date.now() - startTime) / 1000)
        
        // Update the time spent in real-time (optional)
        this.updateTimeSpent(viewId, currentTimeSpent, entityType, entityId)
      }
    }, 5000)
    
    this.visibilityTimers.set(viewKey, timer)
  }

  private async updateTimeSpent(
    viewId: string,
    timeSpent: number,
    entityType: 'facility' | 'medical_professional',
    entityId: string
  ) {
    if (timeSpent < 2) return // Only update if more than 2 seconds
    
    try {
        const { data } = await supabase.auth.getSession()
const token = data.session?.access_token
      await fetch(
        `https://mnthjabxkmgmbuquefyy.supabase.co/functions/v1/track-time-spent`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            view_id: viewId,
            time_spent: timeSpent,
            entity_type: entityType,
            entity_id: entityId,
            session_id: this.sessionId,
            visitor_id: this.visitorId
          })
        }
      )

    } catch (error) {
      console.error('Error updating time spent:', error)
    }
  }

  private pauseTimeTracking(
    entityType: 'facility' | 'medical_professional',
    entityId: string,
    viewId: string
  ) {
    const viewKey = `${entityType}:${entityId}`
    
    if (this.startTimes.has(viewKey)) {
      const startTime = this.startTimes.get(viewKey)!
      const timeSpent = Math.floor((Date.now() - startTime) / 1000)
      
      if (timeSpent > 0) {
        this.updateTimeSpent(viewId, timeSpent, entityType, entityId)
      }
      
      // Clear the start time but keep the timer
      this.startTimes.delete(viewKey)
    }
  }

  async stopTrackingTime(
    entityType: 'facility' | 'medical_professional',
    entityId: string
  ) {
    const viewKey = `${entityType}:${entityId}`
    const viewId = this.viewIds.get(viewKey)
    
    if (viewId && this.startTimes.has(viewKey)) {
      const startTime = this.startTimes.get(viewKey)!
      const timeSpent = Math.floor((Date.now() - startTime) / 1000)
      
      if (timeSpent > 1) {
        await this.updateTimeSpent(viewId, timeSpent, entityType, entityId)
      }
      
      // Clean up
      this.startTimes.delete(viewKey)
      
      if (this.visibilityTimers.has(viewKey)) {
        clearInterval(this.visibilityTimers.get(viewKey))
        this.visibilityTimers.delete(viewKey)
      }
    }
    
    this.viewIds.delete(viewKey)
  }

  async trackHeartbeat(viewId: string, currentTime: number) {
    // Optional: Send heartbeat every minute to keep session alive
    await this.updateTimeSpent(viewId, currentTime, 'facility', '')
  }
}

// Singleton instance
const tracker = new PageViewTrackerWithTimeSpent()

export const usePageViewTrackerWithTimeSpent = () => {
  const activeViewsRef = useRef<Map<string, string>>(new Map())

  const trackPageView = useCallback(async (
    entityType: 'facility' | 'medical_professional',
    entityId: string,
    userId?: string,
    options?: { trackTimeSpent?: boolean; minTimeToTrack?: number }
  ) => {
    const viewKey = `${entityType}:${entityId}`
    
    // Prevent duplicate tracking
    if (activeViewsRef.current.has(viewKey)) return activeViewsRef.current.get(viewKey)!
    
    const viewId = await tracker.trackView(
      entityType, 
      entityId, 
      userId, 
      options?.trackTimeSpent !== false
    )
    
    if (viewId) {
      activeViewsRef.current.set(viewKey, viewId)
    }
    
    return viewId
  }, [])

  const stopTracking = useCallback((
    entityType: 'facility' | 'medical_professional',
    entityId: string
  ) => {
    const viewKey = `${entityType}:${entityId}`
    
    if (activeViewsRef.current.has(viewKey)) {
      tracker.stopTrackingTime(entityType, entityId)
      activeViewsRef.current.delete(viewKey)
    }
  }, [])

  // Clean up all tracking on unmount
  useEffect(() => {
    return () => {
      activeViewsRef.current.forEach((_, viewKey) => {
        const [entityType, entityId] = viewKey.split(':')
        tracker.stopTrackingTime(entityType as any, entityId)
      })
      activeViewsRef.current.clear()
    }
  }, [])

  return { trackPageView, stopTracking }
}