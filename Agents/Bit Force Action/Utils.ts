/**
 * @file Utils.ts
 * Utility and helper functions for the Bit Force Action agent.
 */
import { TraceRouteHop } from './Data';

/**
 * Parses the raw output of a traceroute command from various OS formats.
 * @param rawTraceOutput The raw string output from a traceroute command.
 * @returns An array of TraceRouteHop objects.
 */
export function parseTraceRoute(rawTraceOutput: string): TraceRouteHop[] {
  const lines = rawTraceOutput.trim().split('\n');
  const hops: TraceRouteHop[] = [];

  for (const line of lines) {
    const parts = line.trim().split(/\s+/);
    if (parts.length < 2) continue;

    // A simple heuristic to identify a hop line
    if (!/^\d+$/.test(parts[0])) continue;
    
    const hopNumber = parseInt(parts[0], 10);
    let ip = '';
    let hostname = '';
    let latency = 'N/A';

    // Attempt to find an IP address in the line
    const ipMatch = line.match(/(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})/);
    if (ipMatch) {
      ip = ipMatch[0];
    }

    // Attempt to find a hostname
    const hostnameMatch = line.match(/\(([\w.-]+)\)|([\w.-]+)\s+\([\d.]+\)/);
    if (hostnameMatch) {
      hostname = hostnameMatch[1] || hostnameMatch[2];
      if (hostname === ip) hostname = ''; // Don't use IP as hostname
    }
    
    // Attempt to find latency
    const latencyMatch = line.match(/(\d+\.\d+)\s*ms/);
    if (latencyMatch) {
      latency = `${latencyMatch[1]} ms`;
    }

    if (ip) {
      hops.push({
        hop: hopNumber,
        ip: ip,
        hostname: hostname || 'N/A',
        latency: latency,
      });
    }
  }

  return hops;
}