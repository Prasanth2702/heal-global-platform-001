// // // hooks/usePageViewTrackerWithTimeSpent.ts
// // import { supabase } from '@/integrations/supabase/client'
// // import { useEffect, useRef, useCallback } from 'react'

// // interface TrackPageViewParams {
// //   entityType: 'facility' | 'medical_professional'
// //   entityId: string
// //   userId?: string
// //   trackTimeSpent?: boolean
// //   minTimeToTrack?: number // Minimum time in seconds before tracking
// // }

// // class PageViewTrackerWithTimeSpent {
// //   private visitorId: string | null = null
// //   private sessionId: string | null = null
// //   private startTimes: Map<string, number> = new Map()
// //   private viewIds: Map<string, string> = new Map()
// //   private visibilityTimers: Map<string, NodeJS.Timeout> = new Map()
// //   private isPageVisible: boolean = true

// //   constructor() {
// //     this.initVisitorId()
// //     this.initSessionId()
// //     this.setupVisibilityListeners()
// //   }

// //   private initVisitorId() {
// //     if (typeof window === 'undefined') return
    
// //     let id = localStorage.getItem('visitor_id')
// //     if (!id) {
// //       id = crypto.randomUUID()
// //       localStorage.setItem('visitor_id', id)
// //     }
// //     this.visitorId = id
// //   }

// //   private initSessionId() {
// //     if (typeof window === 'undefined') return
    
// //     let id = sessionStorage.getItem('session_id')
// //     if (!id) {
// //       id = crypto.randomUUID()
// //       sessionStorage.setItem('session_id', id)
// //     }
// //     this.sessionId = id
// //   }

// //   private setupVisibilityListeners() {
// //     if (typeof document === 'undefined') return
    
// //     document.addEventListener('visibilitychange', () => {
// //       this.isPageVisible = !document.hidden
      
// //       // Resume or pause time tracking based on visibility
// //       this.viewIds.forEach((viewId, key) => {
// //         if (this.isPageVisible) {
// //           // Resume tracking
// //           const [entityType, entityId] = key.split(':')
// //           this.startTrackingTime(entityType as any, entityId, viewId)
// //         } else {
// //           // Pause tracking - record current time spent so far
// //           const [entityType, entityId] = key.split(':')
// //           this.pauseTimeTracking(entityType as any, entityId, viewId)
// //         }
// //       })
// //     })
// //   }

// //   private getDeviceType(): 'mobile' | 'desktop' | 'tablet' {
// //     if (typeof window === 'undefined') return 'desktop'
    
// //     const ua = navigator.userAgent
// //     if (/(tablet|ipad|playbook|silk)|(android(?!.*mobile))/i.test(ua)) {
// //       return 'tablet'
// //     }
// //     if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
// //       return 'mobile'
// //     }
// //     return 'desktop'
// //   }

// // async trackView(
// //   entityType: 'facility' | 'medical_professional',
// //   entityId: string,
// //   userId?: string,
// //   trackTimeSpent: boolean = true
// // ): Promise<string> {
// //   if (!this.visitorId) return '';

// //   const viewKey = `${entityType}:${entityId}`;
// //   const viewId = crypto.randomUUID();

// //   try {
// //     let token: string | null = null;
// //     let useAnonKey = false;

// //     // Determine token based on whether user is logged in
// //     if (userId) {
// //       // User is logged in – get session token
// //       const { data } = await supabase.auth.getSession();
// //       token = data.session?.access_token || null;
// //       if (!token) {
// //         console.warn('User ID provided but no active session');
// //         // Fallback to anon key if no session (optional)
// //         useAnonKey = true;
// //       }
// //     } else {
// //       // Anonymous user – use anon key (or no auth header)
// //       useAnonKey = true;
// //     }

// //     const headers: Record<string, string> = {
// //       'Content-Type': 'application/json',
// //     };

// //     if (token) {
// //       headers['Authorization'] = `Bearer ${token}`;
// //     } else if (useAnonKey) {
// //       // If you want to send an anon key (if your edge function allows public access)
// //       headers['apikey'] = import.meta.env.VITE_SUPABASE_ANON_KEY;
// //       // Or keep empty – depends on your edge function's auth requirements
// //     }

// //     const response = await fetch(
// //       'https://mnthjabxkmgmbuquefyy.supabase.co/functions/v1/track-page-view',
// //       {
// //         method: 'POST',
// //         headers,
// //         body: JSON.stringify({
// //           entity_type: entityType,
// //           entity_id: entityId,
// //           device_type: this.getDeviceType(),
// //           visitor_id: this.visitorId,
// //           session_id: this.sessionId,
// //           user_id: userId,
// //           referrer_url: document.referrer,
// //           user_agent: navigator.userAgent,
// //           // view_id: viewId,
// //         }),
// //       }
// //     );

// //     // if (response.ok) {
// //     //   this.viewIds.set(viewKey, viewId);
// //     //   if (trackTimeSpent) {
// //     //     this.startTrackingTime(entityType, entityId, viewId);
// //     //   }
// //     //   return viewId;
// //     // } else {
// //     //   console.error('Track view failed:', response.status, await response.text());
// //     // }
// //      const result = await response.json();

// //     console.log('TRACK VIEW RESPONSE:', result);

// //     if (!response.ok) {
// //       console.error(result);
// //       return '';
// //     }

// //     // ✅ TAKE view_id FROM API RESPONSE
// //     const viewId = result.view_id;

// //     if (!viewId) {
// //       console.error('view_id missing from response');
// //       return '';
// //     }

// //     // ✅ SAVE view_id
// //     this.viewIds.set(viewKey, viewId);

// //     console.log('Saved view_id:', viewId);

// //     const responses = await fetch(
// //         'https://mnthjabxkmgmbuquefyy.supabase.co/functions/v1/track-time-spent',
// //         {
// //           method: 'POST',
// //           headers,
// //           body: JSON.stringify({
// //             view_id: viewId,
// //             time_spent: timeSpent,
// //             entity_type: entityType,
// //             entity_id: entityId,
// //             session_id: this.sessionId,
// //             visitor_id: this.visitorId,
// //           }),
// //         }
// //       )

// //     // ✅ START TIMER
// //     if (trackTimeSpent) {
// //       this.startTrackingTime(entityType, entityId, viewId);
// //     }

// //     return viewId;

// //   } catch (error) {
// //     console.error('Error tracking page view:', error);
// //   }

// //   return '';
// // }
// //   private startTrackingTime(
// //     entityType: 'facility' | 'medical_professional',
// //     entityId: string,
// //     viewId: string
// //   ) {
// //     const viewKey = `${entityType}:${entityId}`
    
// //     // Clear any existing timer
// //     if (this.visibilityTimers.has(viewKey)) {
// //       clearInterval(this.visibilityTimers.get(viewKey))
// //     }
    
// //     // Start time tracking
// //     this.startTimes.set(viewKey, Date.now())
    
// //     // Set up interval to update time spent every 5 seconds while page is visible
// //     const timer = setInterval(() => {
// //       if (this.isPageVisible && this.startTimes.has(viewKey)) {
// //         const startTime = this.startTimes.get(viewKey)!
// //         const currentTimeSpent = Math.floor((Date.now() - startTime) / 1000)
        
// //         // Update the time spent in real-time (optional)
// //         this.updateTimeSpent(viewId, currentTimeSpent, entityType, entityId)
// //       }
// //     }, 5000)
    
// //     this.visibilityTimers.set(viewKey, timer)
// //   }

// // private async updateTimeSpent(
// //   viewId: string,
// //   timeSpent: number,
// //   entityType: 'facility' | 'medical_professional',
// //   entityId: string
// // ) {
// //   if (timeSpent < 2) return;

// //   try {
// //     const { data } = await supabase.auth.getSession();
// //     const token = data.session?.access_token;

// //     const headers: Record<string, string> = {
// //       'Content-Type': 'application/json',
// //     };

// //     if (token) {
// //       headers['Authorization'] = `Bearer ${token}`;
// //     } else {
// //       // ✅ fallback for anonymous users
// //       headers['apikey'] = import.meta.env.VITE_SUPABASE_ANON_KEY;
// //     }

// //     const response = await fetch(
// //       `https://mnthjabxkmgmbuquefyy.supabase.co/functions/v1/track-time-spent`,
// //       {
// //         method: 'POST',
// //         headers,
// //         body: JSON.stringify({
// //           view_id: viewId,
// //           time_spent: timeSpent,
// //           entity_type: entityType,
// //           entity_id: entityId,
// //           session_id: this.sessionId,
// //           visitor_id: this.visitorId
// //         })
// //       }
// //     );

// //     if (!response.ok) {
// //       console.error('Time spent API failed:', await response.text());
// //     }

// //   } catch (error) {
// //     console.error('Error updating time spent:', error);
// //   }
// // }

// //   private pauseTimeTracking(
// //     entityType: 'facility' | 'medical_professional',
// //     entityId: string,
// //     viewId: string
// //   ) {
// //     const viewKey = `${entityType}:${entityId}`
    
// //     if (this.startTimes.has(viewKey)) {
// //       const startTime = this.startTimes.get(viewKey)!
// //       const timeSpent = Math.floor((Date.now() - startTime) / 1000)
      
// //       if (timeSpent > 0) {
// //         this.updateTimeSpent(viewId, timeSpent, entityType, entityId)
// //       }
      
// //       // Clear the start time but keep the timer
// //       this.startTimes.delete(viewKey)
// //     }
// //   }

// //   async stopTrackingTime(
// //     entityType: 'facility' | 'medical_professional',
// //     entityId: string
// //   ) {
// //     const viewKey = `${entityType}:${entityId}`
// //     const viewId = this.viewIds.get(viewKey)
    
// //     if (viewId && this.startTimes.has(viewKey)) {
// //       const startTime = this.startTimes.get(viewKey)!
// //       const timeSpent = Math.floor((Date.now() - startTime) / 1000)
      
// //       if (timeSpent > 1) {
// //         await this.updateTimeSpent(viewId, timeSpent, entityType, entityId)
// //       }
      
// //       // Clean up
// //       this.startTimes.delete(viewKey)
      
// //       if (this.visibilityTimers.has(viewKey)) {
// //         clearInterval(this.visibilityTimers.get(viewKey))
// //         this.visibilityTimers.delete(viewKey)
// //       }
// //     }
    
// //     this.viewIds.delete(viewKey)
// //   }

// //   async trackHeartbeat(viewId: string, currentTime: number) {
// //     // Optional: Send heartbeat every minute to keep session alive
// //     await this.updateTimeSpent(viewId, currentTime, 'facility', '')
// //   }
// // }

// // // Singleton instance
// // const tracker = new PageViewTrackerWithTimeSpent()

// // export const usePageViewTrackerWithTimeSpent = () => {
// //   const activeViewsRef = useRef<Map<string, string>>(new Map())

// //   const trackPageView = useCallback(async (
// //     entityType: 'facility' | 'medical_professional',
// //     entityId: string,
// //     userId?: string,
// //     options?: { trackTimeSpent?: boolean; minTimeToTrack?: number }
// //   ) => {
// //     const viewKey = `${entityType}:${entityId}`
    
// //     // Prevent duplicate tracking
// //     if (activeViewsRef.current.has(viewKey)) return activeViewsRef.current.get(viewKey)!
    
// //     const viewId = await tracker.trackView(
// //       entityType, 
// //       entityId, 
// //       userId, 
// //       options?.trackTimeSpent !== false
// //     )
    
// //     if (viewId) {
// //       activeViewsRef.current.set(viewKey, viewId)
// //     }
    
// //     return viewId
// //   }, [])
// //   const manualUpdateTimeSpent = useCallback(async (
// //   entityType: 'facility' | 'medical_professional',
// //   entityId: string,
// //   timeSpent: number
// // ) => {
// //   const viewKey = `${entityType}:${entityId}`
// //   const viewId = activeViewsRef.current.get(viewKey)

// //   if (!viewId) {
// //     console.warn("No viewId found for manual update")
// //     return
// //   }

// //   await tracker["updateTimeSpent"](
// //     viewId,
// //     timeSpent,
// //     entityType,
// //     entityId
// //   )
// // }, [])

// //   const stopTracking = useCallback((
// //     entityType: 'facility' | 'medical_professional',
// //     entityId: string
// //   ) => {
// //     const viewKey = `${entityType}:${entityId}`
    
// //     if (activeViewsRef.current.has(viewKey)) {
// //       tracker.stopTrackingTime(entityType, entityId)
// //       activeViewsRef.current.delete(viewKey)
// //     }
// //   }, [])

// //   // Clean up all tracking on unmount
// //   useEffect(() => {
// //     return () => {
// //       activeViewsRef.current.forEach((_, viewKey) => {
// //         const [entityType, entityId] = viewKey.split(':')
// //         tracker.stopTrackingTime(entityType as any, entityId)
// //       })
// //       activeViewsRef.current.clear()
// //     }
// //   }, [])

// //   return { trackPageView, stopTracking,manualUpdateTimeSpent }
// // }

// // hooks/usePageViewTrackerWithTimeSpent.ts
// import { supabase } from '@/integrations/supabase/client'
// import { useEffect, useRef, useCallback } from 'react'

// class PageViewTrackerWithTimeSpent {
//   private visitorId: string | null = null
//   private sessionId: string | null = null
//   private startTimes: Map<string, number> = new Map()
//   private viewIds: Map<string, string> = new Map()
//   private visibilityTimers: Map<string, NodeJS.Timeout> = new Map()
//   private isPageVisible: boolean = true

//   constructor() {
//     this.initVisitorId()
//     this.initSessionId()
//     this.setupVisibilityListeners()
//   }

//   private initVisitorId() {
//     if (typeof window === 'undefined') return
//     let id = localStorage.getItem('visitor_id')
//     if (!id) {
//       id = crypto.randomUUID()
//       localStorage.setItem('visitor_id', id)
//     }
//     this.visitorId = id
//   }

//   private initSessionId() {
//     if (typeof window === 'undefined') return
//     let id = sessionStorage.getItem('session_id')
//     if (!id) {
//       id = crypto.randomUUID()
//       sessionStorage.setItem('session_id', id)
//     }
//     this.sessionId = id
//   }

//   private setupVisibilityListeners() {
//     if (typeof document === 'undefined') return
//     document.addEventListener('visibilitychange', () => {
//       this.isPageVisible = !document.hidden
//       this.viewIds.forEach((viewId, key) => {
//         if (this.isPageVisible) {
//           const [entityType, entityId] = key.split(':')
//           this.startTrackingTime(entityType as any, entityId, viewId)
//         } else {
//           const [entityType, entityId] = key.split(':')
//           this.pauseTimeTracking(entityType as any, entityId, viewId)
//         }
//       })
//     })
//   }

//   private getDeviceType(): 'mobile' | 'desktop' | 'tablet' {
//     if (typeof window === 'undefined') return 'desktop'
//     const ua = navigator.userAgent
//     if (/(tablet|ipad|playbook|silk)|(android(?!.*mobile))/i.test(ua)) return 'tablet'
//     if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/i.test(ua)) return 'mobile'
//     return 'desktop'
//   }

//   async trackView(
//     entityType: 'facility' | 'medical_professional',
//     entityId: string,
//     userId?: string,
//     trackTimeSpent: boolean = true
//   ): Promise<string> {
//     if (!this.visitorId) return ''

//     const viewKey = `${entityType}:${entityId}`

//     try {
//       let token: string | null = null
//       let useAnonKey = false

//       if (userId) {
//         const { data } = await supabase.auth.getSession()
//         token = data.session?.access_token || null
//         if (!token) useAnonKey = true
//       } else {
//         useAnonKey = true
//       }

//       const headers: Record<string, string> = {
//         'Content-Type': 'application/json',
//       }

//       if (token) {
//         headers['Authorization'] = `Bearer ${token}`
//       } else if (useAnonKey) {
//         headers['apikey'] = import.meta.env.VITE_SUPABASE_ANON_KEY
//       }

//       const response = await fetch(
//         'https://mnthjabxkmgmbuquefyy.supabase.co/functions/v1/track-page-view',
//         {
//           method: 'POST',
//           headers,
//           body: JSON.stringify({
//             entity_type: entityType,
//             entity_id: entityId,
//             device_type: this.getDeviceType(),
//             visitor_id: this.visitorId,
//             session_id: this.sessionId,
//             user_id: userId,
//             referrer_url: document.referrer,
//             user_agent: navigator.userAgent,
//           }),
//         }
//       )

//       const result = await response.json()
//       console.log('TRACK VIEW RESPONSE:', result)

//       if (!response.ok) {
//         console.error(result)
//         return ''
//       }

//       const realViewId = result.view_id
//       if (!realViewId) {
//         console.error('view_id missing from response')
//         return ''
//       }

//       // Store the real view_id
//       this.viewIds.set(viewKey, realViewId)
//       console.log('Saved view_id:', realViewId)

//       // ✅ Start timer if requested (and trackTimeSpent is true)
//       if (trackTimeSpent === true) {
//         console.log('Starting time tracking for:', entityType, entityId)
//         this.startTrackingTime(entityType, entityId, realViewId)
//       } else {
//         console.warn('trackTimeSpent is false, timer not started')
//       }

//       return realViewId
//     } catch (error) {
//       console.error('Error tracking page view:', error)
//       return ''
//     }
//   }
// // private startTrackingTime(
// //   entityType: 'facility' | 'medical_professional',
// //   entityId: string,
// //   viewId: string
// // ) {
// //   const viewKey = `${entityType}:${entityId}`;

// //   console.log("=================================");
// //   console.log("START TRACKING TIME");
// //   console.log("Entity Type:", entityType);
// //   console.log("Entity Id:", entityId);
// //   console.log("View Id:", viewId);
// //   console.log("Start Time:", new Date().toLocaleString());
// //   console.log("=================================");

// //   // ✅ Clear any existing timer
// //   const existingTimer = this.visibilityTimers.get(viewKey);
// //   if (existingTimer) {
// //     console.log("OLD TIMER FOUND -> CLEARING");
// //     clearInterval(existingTimer);
// //     this.visibilityTimers.delete(viewKey);
// //   }

// //   // ✅ Set start time
// //   if (!this.startTimes.has(viewKey)) {
// //     this.startTimes.set(viewKey, Date.now());
// //   }
// //   console.log("START TIME SAVED:", this.startTimes.get(viewKey));

// //   // ✅ Declare timer variable BEFORE trackTime to avoid TDZ
// //   let timer: NodeJS.Timeout | null = null;

// //   // ✅ Define tracking task that can safely access timer
// //   const trackTime = async () => {
// //     try {
// //       console.log("TRACKING RUNNING:", viewKey);

// //       if (!this.isPageVisible) {
// //         console.log("PAGE HIDDEN - TRACKING PAUSED");
// //         return;
// //       }

// //       if (!this.startTimes.has(viewKey)) {
// //         console.log("NO START TIME FOUND -> STOP TRACKING");
// //         if (timer) clearInterval(timer);
// //         this.visibilityTimers.delete(viewKey);
// //         return;
// //       }

// //       const startTime = this.startTimes.get(viewKey);
// //       if (!startTime) {
// //         console.log("START TIME INVALID");
// //         return;
// //       }

// //       const currentTimeSpent = Math.floor((Date.now() - startTime) / 1000);
// //       console.log("=================================");
// //       console.log("TIME TRACKING RUNNING");
// //       console.log("Current Seconds:", currentTimeSpent);
// //       console.log("Current Time:", new Date().toLocaleString());
// //       console.log("=================================");

// //       // ✅ Skip zero or negative values (optional, updateTimeSpent also has a guard)
// //       if (currentTimeSpent <= 100) {
// //         console.log("INVALID TIME -> SKIPPED");
// //         return;
// //       }

// //       await this.updateTimeSpent(viewId, currentTimeSpent, entityType, entityId);
// //       console.log("TIME UPDATED SUCCESSFULLY", await this.updateTimeSpent(viewId, currentTimeSpent, entityType, entityId));
// //     } catch (error) {
// //       console.error("TRACKING TIMER ERROR:", error);
// //     }
// //   };

// //   // ✅ Execute immediately (first run)
// //   trackTime().catch(err => console.error("Immediate tracking failed:", err));

// //   // ✅ Set up interval for subsequent runs every 5 seconds
// //   timer = setInterval(() => {
// //     trackTime().catch(err => console.error("Interval tracking failed:", err));
// //   }, 5000);

// //   // ✅ Save timer for cleanup
// //   this.visibilityTimers.set(viewKey, timer);
// //   console.log("NEW TIMER SAVED (with immediate first run):", viewKey);
// // }

// private activeTrackingTasks: Map<string, boolean> = new Map();

// private startTrackingTime(
//   entityType: 'facility' | 'medical_professional',
//   entityId: string,
//   viewId: string
// ) {

//   const viewKey = `${entityType}:${entityId}`;

//   console.log("=================================");
//   console.log("START TRACKING TIME");
//   console.log("Entity Type:", entityType);
//   console.log("Entity Id:", entityId);
//   console.log("View Id:", viewId);
//   console.log("Start Time:", new Date().toLocaleString());
//   console.log("=================================");

//   // ✅ Clear old timeout
//   const existingTimer = this.visibilityTimers.get(viewKey);

//   if (existingTimer) {
//     console.log("OLD TIMER FOUND -> CLEARING");
//     clearTimeout(existingTimer);
//     this.visibilityTimers.delete(viewKey);
//   }

//   // ✅ Save start time
//   if (!this.startTimes.has(viewKey)) {
//     this.startTimes.set(viewKey, Date.now());
//   }

//   console.log("START TIME SAVED:", this.startTimes.get(viewKey));

//   // ✅ Prevent duplicate tracking execution
//   this.activeTrackingTasks.set(viewKey, true);

//   // ✅ Recursive timeout function
//   const executeTracking = async () => {

//     try {

//       console.log("=================================");
//       console.log("TRACKING EXECUTION STARTED");
//       console.log("View Key:", viewKey);
//       console.log("Execution Time:", new Date().toLocaleString());
//       console.log("=================================");

//       // ✅ Stop if tracking removed
//       if (!this.activeTrackingTasks.get(viewKey)) {
//         console.log("TRACKING STOPPED");
//         return;
//       }

//       // ✅ Check page visibility
//       if (!this.isPageVisible) {
//         console.log("PAGE HIDDEN - TRACKING PAUSED");

//         // Retry again later
//         const hiddenTimer = setTimeout(executeTracking, 5000);
//         this.visibilityTimers.set(viewKey, hiddenTimer);

//         return;
//       }

//       // ✅ Validate start time
//       if (!this.startTimes.has(viewKey)) {

//         console.log("NO START TIME FOUND");

//         this.activeTrackingTasks.delete(viewKey);

//         if (this.visibilityTimers.has(viewKey)) {
//           clearTimeout(this.visibilityTimers.get(viewKey)!);
//           this.visibilityTimers.delete(viewKey);
//         }

//         return;
//       }

//       const startTime = this.startTimes.get(viewKey)!;

//       const currentTimeSpent = Math.floor(
//         (Date.now() - startTime) / 1000
//       );

//       console.log("TIME TRACKING RUNNING");
//       console.log("Current Seconds:", currentTimeSpent);
//       console.log("Current Time:", new Date().toLocaleString());

//       // ✅ Execute API FIRST
//       await this.updateTimeSpent(
//         viewId,
//         currentTimeSpent,
//         entityType,
//         entityId
//       );

//       console.log("TIME UPDATED SUCCESSFULLY");

//       // ✅ AFTER TASK COMPLETE -> START NEXT TIMEOUT
//       const nextTimer = setTimeout(() => {
//         executeTracking();
//       }, 5000);

//       // ✅ Save timeout reference
//       this.visibilityTimers.set(viewKey, nextTimer);

//       console.log("NEXT TIMEOUT SCHEDULED");

//     } catch (error) {

//       console.error("TRACKING EXECUTION ERROR:", error);

//       // Retry after error
//       const retryTimer = setTimeout(() => {
//         executeTracking();
//       }, 5000);

//       this.visibilityTimers.set(viewKey, retryTimer);
//     }
//   };

//   // ✅ FIRST EXECUTION IMMEDIATELY
//   executeTracking();
// }
// private async updateTimeSpent(
//   viewId: string,
//   timeSpent: number,
//   entityType: 'facility' | 'medical_professional',
//   entityId: string
// ) {
//   // ✅ Only send meaningful time (>= 2 seconds) to avoid noise
//   if (timeSpent < 2) {
//     console.log(`TIME LESS THAN 2 SECONDS (${timeSpent}s) -> SKIPPED`);
//     return;
//   }

//   console.log("=================================");
//   console.log("UPDATE TIME API CALL");
//   console.log("View Id:", viewId);
//   console.log("Time Spent:", timeSpent);
//   console.log("Entity Type:", entityType);
//   console.log("Entity Id:", entityId);
//   console.log("API Time:", new Date().toLocaleString());
//   console.log("=================================");

//   try {
//     const { data } = await supabase.auth.getSession();
//     const token = data.session?.access_token;

//     const headers: Record<string, string> = {
//       'Content-Type': 'application/json',
//     };
//     if (token) {
//       headers['Authorization'] = `Bearer ${token}`;
//     } else {
//       headers['apikey'] = import.meta.env.VITE_SUPABASE_ANON_KEY;
//     }

//     const response = await fetch(
//       `https://mnthjabxkmgmbuquefyy.supabase.co/functions/v1/track-time-spent`,
//       {
//         method: 'POST',
//         headers,
//         body: JSON.stringify({
//           view_id: viewId,
//           time_spent: timeSpent,
//           entity_type: entityType,
//           entity_id: entityId,
//           session_id: this.sessionId,
//           visitor_id: this.visitorId
//         })
//       }
//     );

//     const result = await response.json();
//     console.log("TRACK TIME API RESPONSE:", result);

//     if (!response.ok) {
//       console.error("TRACK TIME API FAILED:", result);
//     }
//   } catch (error) {
//     console.error('UPDATE TIME SPENT ERROR:', error);
//   }
// }
//   // private startTrackingTime(
//   //   entityType: 'facility' | 'medical_professional',
//   //   entityId: string,
//   //   viewId: string
//   // ) {
//   //   const viewKey = `${entityType}:${entityId}`
//   //   console.log('startTrackingTime called for', viewKey, 'viewId:', viewId)

//   //   // Clear any existing timer
//   //   if (this.visibilityTimers.has(viewKey)) {
//   //     clearInterval(this.visibilityTimers.get(viewKey)!)
//   //   }

//   //   // Start time tracking
//   //   this.startTimes.set(viewKey, Date.now())
//   //   console.log('Timer started at:', new Date().toISOString())

//   //   // Set up interval to update time spent every 10 seconds while page is visible
//   //   const timer = setInterval(() => {
//   //     if (this.isPageVisible && this.startTimes.has(viewKey)) {
//   //       const startTime = this.startTimes.get(viewKey)!
//   //       const currentTimeSpent = Math.floor((Date.now() - startTime) / 1000)
//   //       if (currentTimeSpent >= 2) {
//   //         console.log(`Time spent for ${viewKey}: ${currentTimeSpent}s`)
//   //         this.updateTimeSpent(viewId, currentTimeSpent, entityType, entityId)
//   //       }
//   //     }
//   //   }, 10000) // 10 seconds

//   //   this.visibilityTimers.set(viewKey, timer)
//   // }

//   // private async updateTimeSpent(
//   //   viewId: string,
//   //   timeSpent: number,
//   //   entityType: 'facility' | 'medical_professional',
//   //   entityId: string,
//   //   retryCount: number = 0
//   // ): Promise<void> {
//   //   if (timeSpent < 2) return
//   //   if (!viewId) {
//   //     console.error('viewId missing in updateTimeSpent')
//   //     return
//   //   }

//   //   try {
//   //     const { data } = await supabase.auth.getSession()
//   //     const token = data.session?.access_token

//   //     const headers: Record<string, string> = {
//   //       'Content-Type': 'application/json',
//   //     }
//   //     if (token) {
//   //       headers['Authorization'] = `Bearer ${token}`
//   //     } else {
//   //       headers['apikey'] = import.meta.env.VITE_SUPABASE_ANON_KEY
//   //     }

//   //     const response = await fetch(
//   //       'https://mnthjabxkmgmbuquefyy.supabase.co/functions/v1/track-time-spent',
//   //       {
//   //         method: 'POST',
//   //         headers,
//   //         body: JSON.stringify({
//   //           view_id: viewId,
//   //           time_spent: timeSpent,
//   //           entity_type: entityType,
//   //           entity_id: entityId,
//   //           session_id: this.sessionId,
//   //           visitor_id: this.visitorId,
//   //         }),
//   //       }
//   //     )

//   //     const result = await response.json()
//   //     console.log('TRACK TIME RESPONSE:', result)

//   //     if (!response.ok && retryCount < 3) {
//   //       setTimeout(() => {
//   //         this.updateTimeSpent(viewId, timeSpent, entityType, entityId, retryCount + 1)
//   //       }, 1000 * Math.pow(2, retryCount))
//   //     }
//   //   } catch (error) {
//   //     console.error('Error updating time spent:', error)
//   //     if (retryCount < 3) {
//   //       setTimeout(() => {
//   //         this.updateTimeSpent(viewId, timeSpent, entityType, entityId, retryCount + 1)
//   //       }, 1000 * Math.pow(2, retryCount))
//   //     }
//   //   }
//   // }

//   private pauseTimeTracking(
//     entityType: 'facility' | 'medical_professional',
//     entityId: string,
//     viewId: string
//   ) {
//     const viewKey = `${entityType}:${entityId}`
//     if (this.startTimes.has(viewKey)) {
//       const startTime = this.startTimes.get(viewKey)!
//       const timeSpent = Math.floor((Date.now() - startTime) / 1000)
//       if (timeSpent > 0) {
//         this.updateTimeSpent(viewId, timeSpent, entityType, entityId)
//       }
//       this.startTimes.delete(viewKey)
//     }
//   }

//   async stopTrackingTime(
//     entityType: 'facility' | 'medical_professional',
//     entityId: string
//   ) {
//     const viewKey = `${entityType}:${entityId}`
//     const viewId = this.viewIds.get(viewKey)

//     if (viewId && this.startTimes.has(viewKey)) {
//       const startTime = this.startTimes.get(viewKey)!
//       const timeSpent = Math.floor((Date.now() - startTime) / 1000)
//       if (timeSpent > 1) {
//         await this.updateTimeSpent(viewId, timeSpent, entityType, entityId)
//       }
//       this.startTimes.delete(viewKey)

//       if (this.visibilityTimers.has(viewKey)) {
//         clearInterval(this.visibilityTimers.get(viewKey))
//         this.visibilityTimers.delete(viewKey)
//       }
//     }

//     this.viewIds.delete(viewKey)
//   }
// }

// // Singleton instance
// const tracker = new PageViewTrackerWithTimeSpent()

// export const usePageViewTrackerWithTimeSpent = () => {
//   const activeViewsRef = useRef<Map<string, string>>(new Map())

//   const trackPageView = useCallback(
//     async (
//       entityType: 'facility' | 'medical_professional',
//       entityId: string,
//       userId?: string,
//       options?: { trackTimeSpent?: boolean; minTimeToTrack?: number }
//     ) => {
//       const viewKey = `${entityType}:${entityId}`
//       if (activeViewsRef.current.has(viewKey))
//         return activeViewsRef.current.get(viewKey)!

//       const viewId = await tracker.trackView(
//         entityType,
//         entityId,
//         userId,
//         options?.trackTimeSpent !== false // default true
//       )

//       if (viewId) {
//         activeViewsRef.current.set(viewKey, viewId)
//       }

//       return viewId
//     },
//     []
//   )

//   const manualUpdateTimeSpent = useCallback(
//     async (
//       entityType: 'facility' | 'medical_professional',
//       entityId: string,
//       timeSpent: number
//     ) => {
//       const viewKey = `${entityType}:${entityId}`
//       const viewId = activeViewsRef.current.get(viewKey)
//       if (!viewId) {
//         console.warn('No viewId found for manual update')
//         return
//       }
//       await tracker['updateTimeSpent'](viewId, timeSpent, entityType, entityId)
//     },
//     []
//   )

//   const stopTracking = useCallback(
//     (entityType: 'facility' | 'medical_professional', entityId: string) => {
//       const viewKey = `${entityType}:${entityId}`
//       if (activeViewsRef.current.has(viewKey)) {
//         tracker.stopTrackingTime(entityType, entityId)
//         activeViewsRef.current.delete(viewKey)
//       }
//     },
//     []
//   )

//   // Clean up all tracking on unmount
//   useEffect(() => {
//     return () => {
//       activeViewsRef.current.forEach((_, viewKey) => {
//         const [entityType, entityId] = viewKey.split(':')
//         tracker.stopTrackingTime(entityType as any, entityId)
//       })
//       activeViewsRef.current.clear()
//     }
//   }, [])

//   return { trackPageView, stopTracking, manualUpdateTimeSpent }
// }

// hooks/usePageViewTrackerWithTimeSpent.ts
import { supabase } from '@/integrations/supabase/client'
import { useEffect, useRef, useCallback } from 'react'

class PageViewTrackerWithTimeSpent {
  private visitorId: string | null = null
  private sessionId: string | null = null

  private startTimes: Map<string, number> = new Map()
  private viewIds: Map<string, string> = new Map()

  private visibilityTimers: Map<string, ReturnType<typeof setTimeout>> =
    new Map()

  private activeTrackingTasks: Map<string, boolean> = new Map()

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

      this.viewIds.forEach((viewId, key) => {
        const [entityType, entityId] = key.split(':')

        if (this.isPageVisible) {
          this.startTrackingTime(
            entityType as 'facility' | 'medical_professional',
            entityId,
            viewId
          )
        } else {
          this.pauseTimeTracking(
            entityType as 'facility' | 'medical_professional',
            entityId
          )
        }
      })
    })
  }

  private getDeviceType(): 'mobile' | 'desktop' | 'tablet' {
    if (typeof window === 'undefined') return 'desktop'

    const ua = navigator.userAgent

    if (
      /(tablet|ipad|playbook|silk)|(android(?!.*mobile))/i.test(ua)
    ) {
      return 'tablet'
    }

    if (
      /Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/i.test(
        ua
      )
    ) {
      return 'mobile'
    }

    return 'desktop'
  }

  async trackView(
    entityType: 'facility' | 'medical_professional',
    entityId: string,
    userId?: string,
    trackTimeSpent: boolean = true
  ): Promise<string> {
    if (!this.visitorId) return ''

    const viewKey = `${entityType}:${entityId}`

    try {
      let token: string | null = null

      const { data } = await supabase.auth.getSession()

      token = data.session?.access_token || null

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      }

      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      } else {
        headers['Authorization'] = `Bearer ${token || import.meta.env.VITE_TOKEN_TOKEN_ACCESS_TOKEN}`
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
            user_id: userId ,
            referrer_url: document.referrer || null,
            user_agent: navigator.userAgent,
          }),
        }
      )

      const result = await response.json()

      if (!response.ok) {
        console.error('Track view failed:', result)
        return ''
      }

      const realViewId = result?.view_id

      if (!realViewId) {
        return ''
      }

      this.viewIds.set(viewKey, realViewId)

      if (trackTimeSpent) {
        this.startTrackingTime(entityType, entityId, realViewId)
      }

      return realViewId
    } catch (error) {
      console.error('Track view error:', error)
      return ''
    }
  }

  private startTrackingTime(
    entityType: 'facility' | 'medical_professional',
    entityId: string,
    viewId: string
  ) {
    const viewKey = `${entityType}:${entityId}`

    const existingTimer = this.visibilityTimers.get(viewKey)

    if (existingTimer) {
      clearTimeout(existingTimer)
      this.visibilityTimers.delete(viewKey)
    }

    if (!this.startTimes.has(viewKey)) {
      this.startTimes.set(viewKey, Date.now())
    }

      console.log("=================================");
  console.log("START TRACKING TIME");
  console.log("Entity Type:", entityType);
  console.log("Entity Id:", entityId);
  console.log("View Id:", viewId);
  console.log("Start Time:", new Date().toLocaleString());
  console.log("=================================");

    this.activeTrackingTasks.set(viewKey, true)

    const executeTracking = async () => {
      try {
        if (!this.activeTrackingTasks.get(viewKey)) {
          return
        }

        if (!this.isPageVisible) {
          const hiddenTimer = setTimeout(executeTracking, 5000)

          this.visibilityTimers.set(viewKey, hiddenTimer)

          return
        }

        const startTime = this.startTimes.get(viewKey)

        if (!startTime) {
          this.activeTrackingTasks.delete(viewKey)

          const timer = this.visibilityTimers.get(viewKey)

          if (timer) {
            clearTimeout(timer)
            this.visibilityTimers.delete(viewKey)
          }

          return
        }

        const currentTimeSpent = Math.floor(
          (Date.now() - startTime) / 1000
        )

        
      console.log("TIME TRACKING RUNNING");
      console.log("Current Seconds:", currentTimeSpent);
      console.log("Current Time:", new Date().toLocaleString());

        await this.updateTimeSpent(
          viewId,
          currentTimeSpent,
          entityType,
          entityId
        )

        if (this.activeTrackingTasks.get(viewKey)) {
          const nextTimer = setTimeout(executeTracking, 5000)

          this.visibilityTimers.set(viewKey, nextTimer)
        }
      } catch (error) {
        console.error('Tracking execution error:', error)

        if (this.activeTrackingTasks.get(viewKey)) {
          const retryTimer = setTimeout(executeTracking, 5000)

          this.visibilityTimers.set(viewKey, retryTimer)
        }
      }
    }

    executeTracking()
  }

  private async updateTimeSpent(
    viewId: string,
    timeSpent: number,
    entityType: 'facility' | 'medical_professional',
    entityId: string
  ) {
    try {
      if (!viewId) return

      if (timeSpent < 2) return

      const { data } = await supabase.auth.getSession()

      const token = data.session?.access_token || null

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        
      }

      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      } else {
        headers['Authorization'] = `Bearer ${import.meta.env.VITE_TOKEN_TOKEN_ACCESS_TOKEN}`
      }

      const response = await fetch(
        'https://mnthjabxkmgmbuquefyy.supabase.co/functions/v1/track-time-spent',
        {
          method: 'POST',
          headers,
          body: JSON.stringify({
            view_id: viewId,
            time_spent: timeSpent,
            entity_type: entityType,
            entity_id: entityId,
            session_id: this.sessionId,
            visitor_id: this.visitorId,
          }),
        }
      )

      if (!response.ok) {
        const result = await response.json()
        console.error('Track time failed:', result)
      }
    } catch (error) {
      console.error('Update time spent error:', error)
    }
  }

  private pauseTimeTracking(
    entityType: 'facility' | 'medical_professional',
    entityId: string
  ) {
    const viewKey = `${entityType}:${entityId}`

    const timer = this.visibilityTimers.get(viewKey)

    if (timer) {
      clearTimeout(timer)
      this.visibilityTimers.delete(viewKey)
    }
  }

  // async stopTrackingTime(
  //   entityType: 'facility' | 'medical_professional',
  //   entityId: string
  // ) {
  //   const viewKey = `${entityType}:${entityId}`

  //   const viewId = this.viewIds.get(viewKey)

  //   this.activeTrackingTasks.set(viewKey, false)

  //   const timer = this.visibilityTimers.get(viewKey)

  //   if (timer) {
  //     clearTimeout(timer)
  //     this.visibilityTimers.delete(viewKey)
  //   }

  //   if (viewId && this.startTimes.has(viewKey)) {
  //     const startTime = this.startTimes.get(viewKey)!

  //     const finalTimeSpent = Math.floor(
  //       (Date.now() - startTime) / 1000
  //     )

  //     if (finalTimeSpent > 1) {
  //       await this.updateTimeSpent(
  //         viewId,
  //         finalTimeSpent,
  //         entityType,
  //         entityId
  //       )
  //     }

  //     this.startTimes.delete(viewKey)
  //   }

  //   this.viewIds.delete(viewKey)
  //   this.activeTrackingTasks.delete(viewKey)
  // }
  async stopTrackingTime(
  entityType: 'facility' | 'medical_professional',
  entityId: string
) {
  const viewKey = `${entityType}:${entityId}`

  console.log("=================================")
  console.log("STOP TRACKING")
  console.log("View Key:", viewKey)
  console.log("Stop Time:", new Date().toLocaleString())
  console.log("=================================")

  // prevent duplicate stop
  if (!this.activeTrackingTasks.has(viewKey)) {
    return
  }

  const viewId = this.viewIds.get(viewKey)

  // STOP ACTIVE TASK
  this.activeTrackingTasks.set(viewKey, false)

  // CLEAR TIMER
  const timer = this.visibilityTimers.get(viewKey)

  if (timer) {
    clearTimeout(timer)
    this.visibilityTimers.delete(viewKey)
  }

  // FINAL API UPDATE
  if (viewId && this.startTimes.has(viewKey)) {
    const startTime = this.startTimes.get(viewKey)!

    const finalTimeSpent = Math.floor(
      (Date.now() - startTime) / 1000
    )

    console.log(
      "FINAL TIME SPENT:",
      finalTimeSpent
    )

    // SEND ONLY IF > 2 SEC
    if (finalTimeSpent >= 2) {
      await this.updateTimeSpent(
        viewId,
        finalTimeSpent,
        entityType,
        entityId
      )
    }

    // REMOVE START TIME
    this.startTimes.delete(viewKey)
  }

  // CLEANUP
  this.viewIds.delete(viewKey)
  this.activeTrackingTasks.delete(viewKey)

  console.log(
    "TRACKING FULLY STOPPED:",
    viewKey
  )
}
}

const tracker = new PageViewTrackerWithTimeSpent()

export const usePageViewTrackerWithTimeSpent = () => {
  const activeViewsRef = useRef<Map<string, string>>(new Map())

  // const trackPageView = useCallback(
  //   async (
  //     entityType: 'facility' | 'medical_professional',
  //     entityId: string,
  //     userId?: string,
  //     options?: {
  //       trackTimeSpent?: boolean
  //       minTimeToTrack?: number
  //     }
  //   ) => {
  //     const viewKey = `${entityType}:${entityId}`

  //     if (activeViewsRef.current.has(viewKey)) {
  //       return activeViewsRef.current.get(viewKey)!
  //     }

  //     const viewId = await tracker.trackView(
  //       entityType,
  //       entityId,
  //       userId,
  //       options?.trackTimeSpent !== false
  //     )

  //     if (viewId) {
  //       activeViewsRef.current.set(viewKey, viewId)
  //     }

  //     return viewId
  //   },
  //   []
  // )
  // Add this inside the hook implementation (replace existing trackPageView and useEffect)

const trackPageView = useCallback(
  async (
    entityType: 'facility' | 'medical_professional',
    entityId: string,
    userId?: string,
    options?: {
      trackTimeSpent?: boolean
      minTimeToTrack?: number
    }
  ) => {
    const viewKey = `${entityType}:${entityId}`

    // 🔁 Stop any currently active tracking if it's a different entity
    if (activeViewsRef.current.size > 0) {
      const existingKeys = Array.from(activeViewsRef.current.keys())
      for (const key of existingKeys) {
        if (key !== viewKey) {
          const [existingType, existingId] = key.split(':')
          await tracker.stopTrackingTime(
            existingType as 'facility' | 'medical_professional',
            existingId
          )
          activeViewsRef.current.delete(key)
        }
      }
    }

    // If already tracking this exact entity, return existing viewId
    if (activeViewsRef.current.has(viewKey)) {
      return activeViewsRef.current.get(viewKey)!
    }

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
  },
  []
)

// Also ensure the cleanup effect stops all active tracks properly
useEffect(() => {
  return () => {
    // Stop all active tracks when component unmounts
    const stopAll = async () => {
      for (const [viewKey, _] of activeViewsRef.current.entries()) {
        const [entityType, entityId] = viewKey.split(':')
        await tracker.stopTrackingTime(
          entityType as 'facility' | 'medical_professional',
          entityId
        )
      }
      activeViewsRef.current.clear()
    }
    stopAll()
  }
}, [])

  const manualUpdateTimeSpent = useCallback(
    async (
      entityType: 'facility' | 'medical_professional',
      entityId: string,
      timeSpent: number
    ) => {
      const viewKey = `${entityType}:${entityId}`

      const viewId = activeViewsRef.current.get(viewKey)

      if (!viewId) return

      await tracker['updateTimeSpent'](
        viewId,
        timeSpent,
        entityType,
        entityId
      )
    },
    []
  )

  const stopTracking = useCallback(
  async (
    entityType: 'facility' | 'medical_professional',
    entityId: string
  ) => {
    const viewKey = `${entityType}:${entityId}`

    if (activeViewsRef.current.has(viewKey)) {

      await tracker.stopTrackingTime(
        entityType,
        entityId
      )

      activeViewsRef.current.delete(viewKey)
    }
  },
  []
)

  useEffect(() => {
    return () => {
      activeViewsRef.current.forEach((_, viewKey) => {
        const [entityType, entityId] = viewKey.split(':')

        tracker.stopTrackingTime(
          entityType as 'facility' | 'medical_professional',
          entityId
        )
      })

      activeViewsRef.current.clear()
    }
  }, [])

  return {
    trackPageView,
    stopTracking,
    manualUpdateTimeSpent,
  }
}