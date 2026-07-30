import { useEffect, useMemo, useRef, useState } from 'react';

function ImageCropEditor({ file, onCancel, onApply }) {
  const stageRef = useRef(null);
  const dragRef = useRef(null);
  const [imageUrl, setImageUrl] = useState('');
  const [imageSize, setImageSize] = useState(null);
  const [stageSize, setStageSize] = useState(360);
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const metrics = useMemo(() => {
    if (!imageSize) return null;
    const baseScale = Math.max(stageSize / imageSize.width, stageSize / imageSize.height);
    const scale = baseScale * zoom;
    return {
      scale,
      width: imageSize.width * scale,
      height: imageSize.height * scale,
    };
  }, [imageSize, stageSize, zoom]);

  function clampPosition(nextPosition, nextMetrics = metrics) {
    if (!nextMetrics) return nextPosition;
    return {
      x: Math.min(0, Math.max(stageSize - nextMetrics.width, nextPosition.x)),
      y: Math.min(0, Math.max(stageSize - nextMetrics.height, nextPosition.y)),
    };
  }

  useEffect(() => {
    const nextImageUrl = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => setImageSize({ width: image.naturalWidth, height: image.naturalHeight });
    image.src = nextImageUrl;
    setImageUrl(nextImageUrl);

    return () => URL.revokeObjectURL(nextImageUrl);
  }, [file]);

  useEffect(() => {
    if (!stageRef.current) return undefined;
    const observer = new ResizeObserver(([entry]) => {
      setStageSize(Math.round(entry.contentRect.width));
    });
    observer.observe(stageRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!imageSize) return;
    const baseScale = Math.max(stageSize / imageSize.width, stageSize / imageSize.height);
    const width = imageSize.width * baseScale;
    const height = imageSize.height * baseScale;
    setPosition({
      x: (stageSize - width) / 2,
      y: (stageSize - height) / 2,
    });
  }, [imageSize, stageSize]);

  useEffect(() => {
    function onKeyDown(event) {
      if (event.key === 'Escape') onCancel();
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onCancel]);

  function startDrag(event) {
    if (!metrics) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      position,
    };
  }

  function moveDrag(event) {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    setPosition(clampPosition({
      x: drag.position.x + event.clientX - drag.startX,
      y: drag.position.y + event.clientY - drag.startY,
    }));
  }

  function stopDrag(event) {
    if (dragRef.current?.pointerId !== event.pointerId) return;
    dragRef.current = null;
  }

  function changeZoom(event) {
    if (!imageSize || !metrics) return;
    const nextZoom = Number(event.target.value);
    const nextScale = Math.max(stageSize / imageSize.width, stageSize / imageSize.height) * nextZoom;
    const nextMetrics = {
      scale: nextScale,
      width: imageSize.width * nextScale,
      height: imageSize.height * nextScale,
    };
    const centerX = (stageSize / 2 - position.x) / metrics.scale;
    const centerY = (stageSize / 2 - position.y) / metrics.scale;
    setZoom(nextZoom);
    setPosition(clampPosition({
      x: stageSize / 2 - centerX * nextScale,
      y: stageSize / 2 - centerY * nextScale,
    }, nextMetrics));
  }

  function saveCrop() {
    if (!metrics) return;
    onApply({
      x: -position.x / metrics.scale,
      y: -position.y / metrics.scale,
      size: stageSize / metrics.scale,
    });
  }

  return (
    <div className="image-crop-modal" role="dialog" aria-modal="true" aria-labelledby="image-crop-title">
      <div className="image-crop-modal__backdrop" onClick={onCancel} aria-hidden="true" />
      <section className="image-crop-modal__panel">
        <div className="image-crop-modal__heading">
          <div>
            <span className="wizard-step-kicker">עריכת תמונה</span>
            <h3 id="image-crop-title">בחרו את הפנים שיופיעו בסיפור</h3>
            <p>גררו את התמונה, והגדילו או הקטינו עד שהדמות במרכז.</p>
          </div>
          <button type="button" className="image-crop-modal__close" onClick={onCancel} aria-label="סגירת עורך התמונה">×</button>
        </div>

        <div
          className="image-crop-stage"
          ref={stageRef}
          onPointerDown={startDrag}
          onPointerMove={moveDrag}
          onPointerUp={stopDrag}
          onPointerCancel={stopDrag}
        >
          {imageUrl && metrics ? (
            <img
              src={imageUrl}
              alt=""
              draggable="false"
              style={{
                width: `${metrics.width}px`,
                height: `${metrics.height}px`,
                transform: `translate(${position.x}px, ${position.y}px)`,
              }}
            />
          ) : <span className="image-crop-stage__loading">טוענים את התמונה…</span>}
          <span className="image-crop-stage__grid" aria-hidden="true" />
        </div>

        <label className="image-crop-zoom">
          <span>הקטנה</span>
          <input type="range" min="1" max="3" step="0.01" value={zoom} onChange={changeZoom} />
          <span>הגדלה</span>
        </label>

        <div className="image-crop-modal__actions">
          <button type="button" className="back-btn" onClick={onCancel}>ביטול</button>
          <button type="button" className="next-btn" onClick={saveCrop} disabled={!metrics}>שמירת החיתוך</button>
        </div>
      </section>
    </div>
  );
}

export default ImageCropEditor;
