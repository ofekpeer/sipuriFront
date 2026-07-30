const ACCEPTED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);
const MAX_SOURCE_SIZE = 25 * 1024 * 1024;
const MAX_DIMENSION = 1800;
const MIN_DIMENSION = 500;
const COMPRESSION_THRESHOLD = 2.5 * 1024 * 1024;

function loadImage(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();

    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('לא הצלחנו לקרוא את התמונה. נסו לבחור קובץ אחר.'));
    };
    image.src = url;
  });
}

function canvasBlob(canvas) {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error('לא הצלחנו להכין את התמונה להעלאה.'));
      },
      'image/jpeg',
      0.9,
    );
  });
}

export async function prepareBookImage(file) {
  if (!ACCEPTED_TYPES.has(file.type)) {
    throw new Error('ניתן להעלות תמונת JPG, PNG או WebP בלבד.');
  }

  if (file.size > MAX_SOURCE_SIZE) {
    throw new Error('התמונה גדולה מדי. בחרו תמונה שגודלה עד 25MB.');
  }

  const image = await loadImage(file);
  const width = image.naturalWidth;
  const height = image.naturalHeight;

  if (Math.min(width, height) < MIN_DIMENSION) {
    throw new Error('התמונה קטנה מדי. מומלץ לבחור תמונה בגודל 500×500 פיקסלים לפחות.');
  }

  const shouldCompress = (
    file.size > COMPRESSION_THRESHOLD
    || Math.max(width, height) > MAX_DIMENSION
  );

  if (!shouldCompress) {
    return {
      file,
      width,
      height,
      optimized: false,
    };
  }

  const scale = Math.min(1, MAX_DIMENSION / Math.max(width, height));
  const outputWidth = Math.round(width * scale);
  const outputHeight = Math.round(height * scale);
  const canvas = document.createElement('canvas');
  canvas.width = outputWidth;
  canvas.height = outputHeight;

  const context = canvas.getContext('2d');
  if (!context) {
    throw new Error('הדפדפן לא הצליח לעבד את התמונה. נסו קובץ אחר.');
  }
  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = 'high';
  context.fillStyle = '#ffffff';
  context.fillRect(0, 0, outputWidth, outputHeight);
  context.drawImage(image, 0, 0, outputWidth, outputHeight);

  const blob = await canvasBlob(canvas);
  const baseName = file.name.replace(/\.[^.]+$/, '') || 'portrait';
  const optimizedFile = new File(
    [blob],
    `${baseName}-optimized.jpg`,
    { type: 'image/jpeg', lastModified: Date.now() },
  );

  return {
    file: optimizedFile.size < file.size ? optimizedFile : file,
    width,
    height,
    optimized: optimizedFile.size < file.size,
  };
}

export async function cropBookImage(file, crop) {
  const image = await loadImage(file);
  const sourceSize = Math.min(crop.size, image.naturalWidth, image.naturalHeight);
  const outputSize = Math.min(1800, Math.max(900, Math.round(sourceSize)));
  const canvas = document.createElement('canvas');
  canvas.width = outputSize;
  canvas.height = outputSize;

  const context = canvas.getContext('2d');
  if (!context) {
    throw new Error('לא הצלחנו לעבד את החיתוך. נסו שוב.');
  }

  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = 'high';
  context.drawImage(
    image,
    Math.max(0, crop.x),
    Math.max(0, crop.y),
    sourceSize,
    sourceSize,
    0,
    0,
    outputSize,
    outputSize,
  );

  const blob = await canvasBlob(canvas);
  const baseName = file.name.replace(/\.[^.]+$/, '') || 'portrait';
  return new File(
    [blob],
    `${baseName}-cropped.jpg`,
    { type: 'image/jpeg', lastModified: Date.now() },
  );
}
