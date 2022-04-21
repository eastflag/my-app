import sanitizeHtml from 'sanitize-html';

export const sanitizedHtml = (dirtyHtml: string | undefined, isEditorContent = false) => {
  if (dirtyHtml === undefined) return { __html: '' };

  const editorContentSanitizeOptions = {
    allowedTags: ['p', 'em', 'strong', 'iframe', 'img', 'span'],
    allowedClasses: {
      p: ['fancy', 'simple'],
    },
    allowedAttributes: {
      iframe: ['src'],
      img: ['src'],
      span: ['class'],
      p: ['class'],
    },
    allowedSchemes: ['data', 'http', 'https'],
    allowedIframeHostnames: ['www.youtube.com'],
  };

  const cleanHtml = sanitizeHtml(dirtyHtml, isEditorContent ? editorContentSanitizeOptions : undefined);

  return { __html: cleanHtml };
};

export const encodeEscapeLetter = (dirtyString: string) => {
  let result;
  result = dirtyString.replace(/&/g, '&amp;');
  result = result.replace(/</g, '&lt;');
  result = result.replace(/>/g, '&gt;');
  result = result.replace(/'/g, '&#x27;');
  result = result.replace(/"/g, '&quot;');
  result = result.replace(/\(/g, '&#40;');
  result = result.replace(/\)/g, '&#41;');
  result = result.replace(/\//g, '&#x2F;');
  result = result.replace(/%/g, '\\%');
  return result;
};
