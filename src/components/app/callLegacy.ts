export default function callLegacy(name: string, ...args: unknown[]) {
  const legacy = window as unknown as Record<string, (...args: unknown[]) => void>;
  legacy[name]?.(...args);
}
