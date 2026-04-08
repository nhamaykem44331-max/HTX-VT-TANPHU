'use client'

import React, { useEffect, useRef, useState } from 'react'
import { Bold, Heading2, Heading3, Italic, List, ListOrdered, Quote, Redo2, RemoveFormatting, Underline, Undo2, type LucideIcon } from 'lucide-react'
import { convertPlainTextToHtml, normalizeRichTextContent } from '@/lib/rich-text'

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

interface ToolbarButton {
  label: string
  icon: LucideIcon
  action: () => void
}

function runCommand(command: string, value?: string) {
  document.execCommand(command, false, value)
}

function insertHtml(html: string) {
  runCommand('insertHTML', html)
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder = 'Dán nội dung từ Word hoặc nhập nội dung bài viết...',
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)
  const [html, setHtml] = useState(() => normalizeRichTextContent(value))

  useEffect(() => {
    const normalized = normalizeRichTextContent(value)

    if (normalized === html) {
      return
    }

    setHtml(normalized)

    if (editorRef.current && document.activeElement !== editorRef.current) {
      editorRef.current.innerHTML = normalized
    }
  }, [html, value])

  const syncFromEditor = (normalize = false) => {
    const nextValue = editorRef.current?.innerHTML ?? ''
    const resolvedValue = normalize ? normalizeRichTextContent(nextValue) : nextValue

    setHtml(resolvedValue)
    onChange(resolvedValue)

    if (normalize && editorRef.current && editorRef.current.innerHTML !== resolvedValue) {
      editorRef.current.innerHTML = resolvedValue
    }
  }

  const applyAction = (action: () => void) => {
    editorRef.current?.focus()
    action()
    syncFromEditor()
  }

  const toolbarButtons: ToolbarButton[] = [
    { label: 'Hoàn tác', icon: Undo2, action: () => runCommand('undo') },
    { label: 'Làm lại', icon: Redo2, action: () => runCommand('redo') },
    { label: 'Đậm', icon: Bold, action: () => runCommand('bold') },
    { label: 'Nghiêng', icon: Italic, action: () => runCommand('italic') },
    { label: 'Gạch chân', icon: Underline, action: () => runCommand('underline') },
    { label: 'Tiêu đề lớn', icon: Heading2, action: () => runCommand('formatBlock', '<h2>') },
    { label: 'Tiêu đề nhỏ', icon: Heading3, action: () => runCommand('formatBlock', '<h3>') },
    { label: 'Danh sách chấm', icon: List, action: () => runCommand('insertUnorderedList') },
    { label: 'Danh sách số', icon: ListOrdered, action: () => runCommand('insertOrderedList') },
    { label: 'Trích dẫn', icon: Quote, action: () => runCommand('formatBlock', '<blockquote>') },
    { label: 'Xóa định dạng', icon: RemoveFormatting, action: () => runCommand('removeFormat') },
  ]

  return (
    <div className="overflow-hidden rounded-xl border border-gray-300">
      <div className="flex flex-wrap gap-2 border-b border-gray-200 bg-gray-50 px-3 py-2">
        {toolbarButtons.map(({ label, icon: Icon, action }) => (
          <button
            key={label}
            type="button"
            onMouseDown={(event) => {
              event.preventDefault()
              applyAction(action)
            }}
            className="inline-flex items-center gap-1 rounded-md border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:border-orange-300 hover:text-orange-600"
            title={label}
          >
            <Icon size={14} />
            <span>{label}</span>
          </button>
        ))}
      </div>

      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        className="rich-text-editor__content"
        data-placeholder={placeholder}
        onInput={() => syncFromEditor()}
        onBlur={() => syncFromEditor(true)}
        onPaste={(event) => {
          event.preventDefault()

          const clipboardHtml = event.clipboardData.getData('text/html')
          const clipboardText = event.clipboardData.getData('text/plain')
          const htmlToInsert = clipboardHtml
            ? normalizeRichTextContent(clipboardHtml)
            : convertPlainTextToHtml(clipboardText)

          if (!htmlToInsert) {
            return
          }

          editorRef.current?.focus()
          insertHtml(htmlToInsert)
          syncFromEditor(true)
        }}
        dangerouslySetInnerHTML={{ __html: html }}
      />

      <div className="border-t border-gray-200 bg-gray-50 px-3 py-2 text-xs text-gray-500">
        Dán trực tiếp từ Word để giữ đoạn văn, chữ đậm, tiêu đề và danh sách.
      </div>
    </div>
  )
}
