// Types
export interface SystemInfo {
  browser: {
    name: string;
    version: string;
    platform: string;
    language: string;
    online: boolean;
    cookiesEnabled: boolean;
    doNotTrack: boolean | null;
  };
  location: {
    country: string;
    city: string;
    region: string;
    latitude: number | null;
    longitude: number | null;
    accuracy: number | null;
  };
  ip: {
    address: string;
    organization: string;
    asNumber: string;
    security: {
      proxy: boolean;
      vpn: boolean;
      tor: boolean;
    };
  };
  hardware: {
    memory: {
      total: number;
      available: number;
    };
    battery?: {
      charging: boolean;
      level: number;
      chargingTime: number;
      dischargingTime: number;
    };
    cores: number;
    gpu: string;
  };
  software: {
    plugins: string[];
    mimeTypes: string[];
    permissions: Record<string, string>;
    mediaCapabilities: {
      videoCodecs: string[];
      audioCodecs: string[];
    };
  };
  network: {
    type: string;
    effectiveType: string;
    downlink: number;
    rtt: number;
    saveData: boolean;
  };
  storage: {
    quota: number;
    usage: number;
    available: number;
  } | null;
  performance: {
    memory: {
      jsHeapSizeLimit: number;
      totalJSHeapSize: number;
      usedJSHeapSize: number;
    } | null;
    navigation: {
      type: string;
    };
    timing: {
      loadTime: number;
      domInteractive: number;
    };
  };
}

interface IpapiResponse {
  ip: string;
  city: string;
  region: string;
  country_name: string;
  latitude: number;
  longitude: number;
  org: string;
  asn: string;
  proxy: boolean;
}

// Browser information
function getBrowserInfo(): SystemInfo['browser'] {
  const userAgent = navigator.userAgent;
  let browserName = "Unknown";
  let browserVersion = "Unknown";

  if (userAgent.indexOf("Firefox") > -1) {
    browserName = "Firefox";
    browserVersion = userAgent.match(/Firefox\/([0-9.]+)/)?.[1] || "Unknown";
  } else if (userAgent.indexOf("Chrome") > -1) {
    browserName = "Chrome";
    browserVersion = userAgent.match(/Chrome\/([0-9.]+)/)?.[1] || "Unknown";
  } else if (userAgent.indexOf("Safari") > -1) {
    browserName = "Safari";
    browserVersion = userAgent.match(/Version\/([0-9.]+)/)?.[1] || "Unknown";
  } else if (userAgent.indexOf("Edge") > -1) {
    browserName = "Edge";
    browserVersion = userAgent.match(/Edge\/([0-9.]+)/)?.[1] || "Unknown";
  } else if (userAgent.indexOf("Opera") > -1) {
    browserName = "Opera";
    browserVersion = userAgent.match(/Opera\/([0-9.]+)/)?.[1] || "Unknown";
  }

  return {
    name: browserName,
    version: browserVersion,
    platform: navigator.platform,
    language: navigator.language,
    online: navigator.onLine,
    cookiesEnabled: navigator.cookieEnabled,
    doNotTrack: navigator.doNotTrack === "1" ? true : navigator.doNotTrack === "0" ? false : null,
  };
}

async function getLocationAndIpInfo(): Promise<{ 
  location: SystemInfo['location']; 
  ip: SystemInfo['ip'];
}> {
  try {
    const response = await fetch('https://ipapi.co/json/');
    const data: IpapiResponse = await response.json();

    return {
      location: {
        country: data.country_name,
        city: data.city,
        region: data.region,
        latitude: data.latitude,
        longitude: data.longitude,
        accuracy: null,
      },
      ip: {
        address: data.ip,
        organization: data.org,
        asNumber: data.asn,
        security: {
          proxy: data.proxy,
          vpn: data.proxy,
          tor: false,
        },
      },
    };
  } catch (error) {
    console.error('Error fetching location and IP info:', error);
    return {
      location: {
        country: 'Unknown',
        city: 'Unknown',
        region: 'Unknown',
        latitude: null,
        longitude: null,
        accuracy: null,
      },
      ip: {
        address: 'Unknown',
        organization: 'Unknown',
        asNumber: 'Unknown',
        security: {
          proxy: false,
          vpn: false,
          tor: false,
        },
      },
    };
  }
}

function getPlugins(): string[] {
  const plugins: string[] = [];
  for (let i = 0; i < navigator.plugins.length; i++) {
    plugins.push(navigator.plugins[i].name);
  }
  return plugins;
}

function getMimeTypes(): string[] {
  const mimeTypes: string[] = [];
  for (let i = 0; i < navigator.mimeTypes.length; i++) {
    mimeTypes.push(navigator.mimeTypes[i].type);
  }
  return mimeTypes;
}

async function getPermissions(): Promise<Record<string, string>> {
  const permissions: Record<string, string> = {};
  const permissionQueries = [
    'geolocation',
    'notifications',
    'microphone',
    'camera',
    'clipboard-read',
    'clipboard-write'
  ];

  if ('permissions' in navigator) {
    for (const permission of permissionQueries) {
      try {
        const result = await navigator.permissions.query({ name: permission as PermissionName });
        permissions[permission] = result.state;
      } catch (error) {
        permissions[permission] = 'unsupported';
      }
    }
  }

  return permissions;
}

async function getHardwareInfo(): Promise<SystemInfo['hardware']> {
  const hardwareInfo: SystemInfo['hardware'] = {
    memory: {
      total: navigator.deviceMemory ? navigator.deviceMemory * 1024 : 0,
      available: 0,
    },
    cores: navigator.hardwareConcurrency || 0,
    gpu: 'Unknown',
  };

  if ('getBattery' in navigator) {
    try {
      const battery = await (navigator as any).getBattery();
      hardwareInfo.battery = {
        charging: battery.charging,
        level: battery.level * 100,
        chargingTime: battery.chargingTime,
        dischargingTime: battery.dischargingTime,
      };
    } catch (error) {
      console.error('Battery API not supported:', error);
    }
  }

  return hardwareInfo;
}

async function getStorageInfo(): Promise<SystemInfo['storage']> {
  if ('storage' in navigator && 'estimate' in navigator.storage) {
    try {
      const estimate = await navigator.storage.estimate();
      return {
        quota: estimate.quota || 0,
        usage: estimate.usage || 0,
        available: (estimate.quota || 0) - (estimate.usage || 0),
      };
    } catch (error) {
      console.error('Storage API error:', error);
    }
  }
  return null;
}

function getNetworkInfo(): SystemInfo['network'] {
  const connection = (navigator as any).connection;
  return {
    type: connection?.type || 'unknown',
    effectiveType: connection?.effectiveType || 'unknown',
    downlink: connection?.downlink || 0,
    rtt: connection?.rtt || 0,
    saveData: connection?.saveData || false,
  };
}

function getPerformanceInfo(): SystemInfo['performance'] {
  const performance = window.performance;
  const memory = (performance as any).memory;
  const timing = performance.timing;

  return {
    memory: memory ? {
      jsHeapSizeLimit: memory.jsHeapSizeLimit,
      totalJSHeapSize: memory.totalJSHeapSize,
      usedJSHeapSize: memory.usedJSHeapSize,
    } : null,
    navigation: {
      type: performance.navigation ? 
        ['navigate', 'reload', 'back_forward', 'prerender'][performance.navigation.type] : 
        'unknown',
    },
    timing: {
      loadTime: timing ? timing.loadEventEnd - timing.navigationStart : 0,
      domInteractive: timing ? timing.domInteractive - timing.navigationStart : 0,
    },
  };
}

export async function getSystemInfo(): Promise<SystemInfo> {
  const [locationAndIp, permissions, hardwareInfo, storageInfo] = await Promise.all([
    getLocationAndIpInfo(),
    getPermissions(),
    getHardwareInfo(),
    getStorageInfo(),
  ]);

  return {
    browser: getBrowserInfo(),
    ...locationAndIp,
    hardware: hardwareInfo,
    software: {
      plugins: getPlugins(),
      mimeTypes: getMimeTypes(),
      permissions,
      mediaCapabilities: {
        videoCodecs: ['h264', 'vp8', 'vp9'],
        audioCodecs: ['aac', 'opus', 'vorbis'],
      },
    },
    network: getNetworkInfo(),
    storage: storageInfo,
    performance: getPerformanceInfo(),
  };
}

import { useState, useEffect } from 'react';

export function useSystemInfo() {
  const [systemInfo, setSystemInfo] = useState<SystemInfo | null>(null);

  useEffect(() => {
    getSystemInfo().then(setSystemInfo);
  }, []);

  return systemInfo;
}
