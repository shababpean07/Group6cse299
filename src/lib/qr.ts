// QR code generation utility using the 'qrcode' package
export async function generateQrDataUrl(data: string, size: number = 256): Promise<string> {
  const { toDataURL } = await import('qrcode');
  // toDataURL returns a data URL of a PNG image
  return toDataURL(data, { width: size, height: size, margin: 2 });
}
