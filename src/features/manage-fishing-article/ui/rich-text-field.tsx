"use client";

import { useRef, useState } from "react";
import type { User } from "firebase/auth";
import { EditorContent, useEditor } from "@tiptap/react";
import Image from "@tiptap/extension-image";
import StarterKit from "@tiptap/starter-kit";
import { uploadArticleImage } from "../api/upload-article-image";
import styles from "./fishing-article-editor.module.scss";

type RichTextFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  imageLabel: string;
  imageAltPrompt: string;
  linkLabel: string;
  imageButtonLabel: string;
  uploadingLabel: string;
  uploadErrorLabel: string;
  toolbarLabels: Record<string, string>;
  slug: string;
  user: User | null;
};

export function RichTextField({ label, value, onChange, imageLabel, imageAltPrompt, linkLabel, imageButtonLabel, uploadingLabel, uploadErrorLabel, toolbarLabels, slug, user }: RichTextFieldProps) {
  const fileInput = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [StarterKit.configure({ heading: { levels: [2, 3] }, link: { openOnClick: false, protocols: ["http", "https", "mailto"] }, code: false, codeBlock: false }), Image.configure({ allowBase64: false })],
    content: value || "<p></p>",
    editorProps: { attributes: { "aria-label": label } },
    onUpdate: ({ editor: currentEditor }) => onChange(currentEditor.getHTML()),
  });

  async function insertImage(file?: File) {
    if (!file || !editor) return;
    const alt = window.prompt(imageAltPrompt, "");
    if (alt === null) return;
    setUploadError("");
    setUploading(true);
    try {
      if (!user) throw new Error(uploadErrorLabel);
      const { url } = await uploadArticleImage(file, slug, await user.getIdToken());
      editor.chain().focus().setImage({ src: url, alt: alt.trim() }).run();
    } catch {
      setUploadError(uploadErrorLabel);
    } finally {
      setUploading(false);
      if (fileInput.current) fileInput.current.value = "";
    }
  }

  function setLink() {
    if (!editor) return;
    const href = window.prompt(linkLabel, editor.getAttributes("link").href ?? "https://");
    if (href === null) return;
    if (!href.trim()) editor.chain().focus().extendMarkRange("link").unsetLink().run();
    else editor.chain().focus().extendMarkRange("link").setLink({ href: href.trim() }).run();
  }

  return (
    <div className={styles.richField}>
      <span className={styles.richLabel}>{label}</span>
      <div className={styles.editorShell}>
        {editor ? (
          <div className={styles.toolbar} role="group" aria-label={label}>
            <button type="button" title={toolbarLabels.bold} aria-label={toolbarLabels.bold} aria-pressed={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()}><strong>B</strong></button>
            <button type="button" title={toolbarLabels.italic} aria-label={toolbarLabels.italic} aria-pressed={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()}><em>I</em></button>
            <button type="button" title={toolbarLabels.heading2} aria-label={toolbarLabels.heading2} aria-pressed={editor.isActive("heading", { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>H2</button>
            <button type="button" title={toolbarLabels.heading3} aria-label={toolbarLabels.heading3} aria-pressed={editor.isActive("heading", { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>H3</button>
            <button type="button" title={toolbarLabels.bulletList} aria-label={toolbarLabels.bulletList} aria-pressed={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()}>•</button>
            <button type="button" title={toolbarLabels.orderedList} aria-label={toolbarLabels.orderedList} aria-pressed={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()}>1.</button>
            <button type="button" title={toolbarLabels.quote} aria-label={toolbarLabels.quote} aria-pressed={editor.isActive("blockquote")} onClick={() => editor.chain().focus().toggleBlockquote().run()}>“ ”</button>
            <button type="button" title={toolbarLabels.undo} aria-label={toolbarLabels.undo} disabled={!editor.can().undo()} onClick={() => editor.chain().focus().undo().run()}>↶</button>
            <button type="button" title={toolbarLabels.redo} aria-label={toolbarLabels.redo} disabled={!editor.can().redo()} onClick={() => editor.chain().focus().redo().run()}>↷</button>
            <button type="button" title={linkLabel} aria-label={linkLabel} aria-pressed={editor.isActive("link")} onClick={setLink}>↗</button>
            <button type="button" title={imageLabel} aria-label={imageLabel} disabled={uploading || !slug} onClick={() => fileInput.current?.click()}>{uploading ? uploadingLabel : `＋ ${imageButtonLabel}`}</button>
            <input ref={fileInput} className={styles.hiddenFileInput} type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={(event) => void insertImage(event.target.files?.[0])} />
          </div>
        ) : null}
        <EditorContent className={styles.richContent} editor={editor} />
      </div>
      {uploadError ? <span className={styles.error} role="alert">{uploadError}</span> : null}
    </div>
  );
}
