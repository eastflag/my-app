import { sanitizedHtml, encodeEscapeLetter } from './HtmlUtils';

describe('HtmlUtils', () => {
  describe('sanitizedHtml', () => {
    it(`return sanitized html with 'sanitize-html' module default config`, () => {
      expect(sanitizedHtml(undefined)).toEqual({ __html: '' });
      expect(
        sanitizedHtml('<script> <h1>test</h1> document.getElementById("demo").innerHTML = "Test"; </script>')
      ).toEqual({ __html: '' });
      expect(
        sanitizedHtml(
          '<p>Must Exist</p><script> <h1>test</h1> document.getElementById("demo").innerHTML = "Test"; </script>'
        )
      ).toEqual({ __html: '<p>Must Exist</p>' });
      expect(
        sanitizedHtml('someText<script> <h1>test</h1> document.getElementById("demo").innerHTML = "Test"; </script>')
      ).toEqual({ __html: 'someText' });
    });

    it(`return sanitized html with 'sanitize-html' module editor content config`, () => {
      expect(
        sanitizedHtml('<script> <h1>test</h1> document.getElementById("demo").innerHTML = "Test"; </script>')
      ).toEqual({ __html: '' });
      expect(
        sanitizedHtml(
          '<p><span class="ql-size-large">fasdf</span></p><p><span class="ql-size-small">small</span></p><p><span class="ql-size-large">large</span></p><iframe class="ql-video" frameborder="0" allowfullscreen="true" src="https://www.youtube.com/embed/VrGj5pE88B4?showinfo=0"></iframe><p>Must Exist</p><script> <h1>test</h1> document.getElementById("demo").innerHTML = "Test"; </script>',
          true
        )
      ).toEqual({
        __html:
          '<p><span class="ql-size-large">fasdf</span></p><p><span class="ql-size-small">small</span></p><p><span class="ql-size-large">large</span></p><iframe src="https://www.youtube.com/embed/VrGj5pE88B4?showinfo=0"></iframe><p>Must Exist</p>',
      });
    });
  });

  describe('encodeEscapeLetter', () => {
    it('return decode string', () => {
      const result = encodeEscapeLetter('&&&<><>\'"()()%');
      expect(result).toBe('&amp;&amp;&amp;&lt;&gt;&lt;&gt;&#x27;&quot;&#40;&#41;&#40;&#41;\\%');
    });
  });
});
