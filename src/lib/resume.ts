const DOWNLOAD_NAME = "Trishia-Kyle-Bagtas-Resume.pdf";

export function getResumeDownloadUrl(url: string) {
  if (!url.includes("/storage/v1/object/public/")) return url;

  const [baseUrl] = url.split("#", 1);
  const separator = baseUrl.includes("?") ? "&" : "?";

  return `${baseUrl}${separator}download=${encodeURIComponent(DOWNLOAD_NAME)}`;
}
