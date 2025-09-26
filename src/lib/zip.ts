import JSZip from "jszip";

export async function downloadZip(images: { name: string; data: Blob }[]) {
  const zip = new JSZip();

  images.forEach((image) => {
    zip.file(image.name, image.data);
  });

  return zip;
}

export async function getImageAsBlob(imageUrl: string): Promise<Blob> {
  const response = await fetch(imageUrl);
  if (!response.ok) {
    throw new Error(`Failed to fetch image: ${response.statusText}`);
  }
  return response.blob();
}
