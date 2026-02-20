import { supabase } from '@/lib/customSupabaseClient';

// Function to convert urlBase64 to Uint8Array
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export async function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('Service Worker registered with scope:', registration.scope);
      return registration;
    } catch (error) {
      console.error('Service Worker registration failed:', error);
      return null;
    }
  }
  return null;
}

export async function subscribeUserToPush(userId) {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
    console.warn('Push messaging is not supported');
    return null;
  }

  const registration = await navigator.serviceWorker.ready;
  const existingSubscription = await registration.pushManager.getSubscription();

  if (existingSubscription) {
    console.log('User is already subscribed.');
    // Here we can re-sync with backend if needed, for now we just return
    return existingSubscription;
  }

  try {
    const vapidPublicKey = import.meta.env.VITE_VAPID_PUBLIC_KEY;
    if (!vapidPublicKey) {
      throw new Error("VITE_VAPID_PUBLIC_KEY not found in environment variables.");
    }
    const applicationServerKey = urlBase64ToUint8Array(vapidPublicKey);

    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey,
    });
    console.log('User is subscribed.');

    // Send subscription to backend
    const { error } = await supabase.from('push_subscriptions').insert({
      user_id: userId,
      subscription_details: subscription.toJSON(),
    });

    if (error) {
      console.error('Error saving push subscription:', error);
      // If saving fails, unsubscribe to avoid inconsistent state
      await subscription.unsubscribe();
      return null;
    }
    
    console.log('Push subscription saved to backend.');
    return subscription;

  } catch (error) {
    console.error('Failed to subscribe the user: ', error);
    return null;
  }
}

export async function unsubscribeUserFromPush(userId) {
  if (!('serviceWorker' in navigator)) return;

  const registration = await navigator.serviceWorker.ready;
  const subscription = await registration.pushManager.getSubscription();

  if (subscription) {
    const successful = await subscription.unsubscribe();
    if (successful) {
      console.log('User unsubscribed from push service.');
      const { error } = await supabase
        .from('push_subscriptions')
        .delete()
        .eq('user_id', userId)
        .eq('subscription_details->>endpoint', subscription.endpoint);
      
      if (error) {
        console.error('Error deleting push subscription from backend:', error);
      } else {
        console.log('Push subscription deleted from backend.');
      }
    }
  }
}