export const extractQualities = (formats = []) => {
  const map = new Map();

  for (const format of formats) {
    if (!format.height || !format.format_id || format.vcodec === "none") continue;

    const key = String(format.height);
    if (!map.has(key)) {
      map.set(key, {
        label: `${format.height}p`,
        height: format.height,
        formatId: format.format_id,
        fps: format.fps || null,
        filesize: format.filesize || format.filesize_approx || null,
      });
    }
  }

  return [...map.values()].sort((a, b) => b.height - a.height);
};
