export function deriveEnvioReadableId(prefix: string, chainId: number) {
  return prefix + "-" + chainId;
}
