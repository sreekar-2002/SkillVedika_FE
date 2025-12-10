"use client";

import { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import {
  FiBold,
  FiItalic,
  FiUnderline,
  FiList,
  FiRotateCcw,
  FiRotateCw,
  FiType,
  FiCode,
} from "react-icons/fi";
import { BiParagraph } from "react-icons/bi";

/* =========================================================
   FIXED: Move sub-components OUTSIDE TipTapEditor
========================================================= */

function ToolbarButton({ command, active, Icon, children, title, disabled }) {
  return (
    <button
      type="button"
      onMouseDown={(e) => {
        e.preventDefault();
        if (!disabled) command();
      }}
      disabled={disabled}
      title={title}
      className={`p-2.5 rounded-lg transition-all duration-200 font-semibold ${
        disabled
          ? "opacity-40 cursor-not-allowed"
          : active
          ? "bg-cyan-500 text-white shadow-sm"
          : "text-gray-600 hover:bg-cyan-50 hover:text-cyan-600 cursor-pointer"
      }`}
    >
      {Icon ? <Icon size={18} /> : children}
    </button>
  );
}

function HeadingButton({ level, command, active }) {
  return (
    <button
      type="button"
      onMouseDown={(e) => {
        e.preventDefault();
        command();
      }}
      title={`Heading ${level}`}
      className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
        active
          ? "bg-cyan-500 text-white shadow-sm"
          : "text-gray-600 hover:bg-cyan-50 hover:text-cyan-600"
      }`}
    >
      H<sub className="text-xs">{level}</sub>
    </button>
  );
}

/* =========================================================
   MAIN EDITOR COMPONENT
========================================================= */

export default function TipTapEditor({ value, onChange }) {
  const editor = useEditor({
    extensions: [StarterKit, Underline],
    content: value,
    immediatelyRender: false,
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });

  // Keep editor content in sync when `value` prop changes from parent
  useEffect(() => {
    if (!editor) return;
    try {
      const current = editor.getHTML();
      // Only update if external value differs from editor's current content
      if ((value || "") !== current) {
        editor.commands.setContent(value || "");
      }
    } catch {
      // ignore
    }
  }, [value, editor]);

  if (!editor) return null;

  return (
    <div className="border border-gray-300 rounded-xl bg-white shadow-sm overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 px-3 py-3 bg-gray-100 text-sm border-b border-gray-300">
        <ToolbarButton
          command={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive("bold")}
          Icon={FiBold}
          title="Bold"
        />

        <ToolbarButton
          command={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive("italic")}
          Icon={FiItalic}
          title="Italic"
        />

        <ToolbarButton
          command={() => editor.chain().focus().toggleUnderline().run()}
          active={editor.isActive("underline")}
          Icon={FiUnderline}
          title="Underline"
        />

        <ToolbarButton
          command={() => editor.chain().focus().toggleStrike().run()}
          active={editor.isActive("strike")}
        >
          <span className="text-base" style={{ textDecoration: "line-through" }}>
            S
          </span>
        </ToolbarButton>

        <div className="mx-1 border-r border-gray-300 h-6"></div>

        {[1, 2, 3, 4, 5, 6].map((level) => (
          <HeadingButton
            key={level}
            level={level}
            command={() =>
              editor.chain().focus().toggleHeading({ level }).run()
            }
            active={editor.isActive("heading", { level })}
          />
        ))}

        <div className="mx-1 border-r border-gray-300 h-6"></div>

        <ToolbarButton
          command={() => editor.chain().focus().setParagraph().run()}
          active={editor.isActive("paragraph")}
          Icon={BiParagraph}
          title="Paragraph"
        />

        <div className="mx-1 border-r border-gray-300 h-6"></div>

        <ToolbarButton
          command={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive("bulletList")}
          Icon={FiList}
        />

        <ToolbarButton
          command={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive("orderedList")}
        >
          <span className="text-sm font-bold">1.</span>
        </ToolbarButton>

        <div className="mx-1 border-r border-gray-300 h-6"></div>

        <ToolbarButton
          command={() => editor.chain().focus().toggleBlockquote().run()}
          active={editor.isActive("blockquote")}
        >
          <span className="text-xl">{"\""}</span>
        </ToolbarButton>

        <ToolbarButton
          command={() => editor.chain().focus().toggleCodeBlock().run()}
          active={editor.isActive("codeBlock")}
          Icon={FiCode}
        />

        <ToolbarButton
          command={() => editor.chain().focus().toggleCode().run()}
          active={editor.isActive("code")}
        >
          <span className="text-sm font-mono">{'`'}</span>
        </ToolbarButton>

        <div className="mx-1 border-r border-gray-300 h-6"></div>

        <ToolbarButton
          command={() => editor.chain().focus().setHorizontalRule().run()}
        >
          <span className="text-base font-bold">—</span>
        </ToolbarButton>

        <ToolbarButton
          command={() => editor.chain().focus().setHardBreak().run()}
        >
          <span className="text-base">↵</span>
        </ToolbarButton>

        <div className="mx-1 border-r border-gray-300 h-6"></div>

        <ToolbarButton
          command={() => editor.chain().focus().undo().run()}
          Icon={FiRotateCcw}
        />

        <ToolbarButton
          command={() => editor.chain().focus().redo().run()}
          Icon={FiRotateCw}
        />

        <div className="mx-1 border-r border-gray-300 h-6"></div>

        <ToolbarButton
          command={() =>
            editor.chain().focus().clearNodes().unsetAllMarks().run()
          }
          Icon={FiType}
          title="Clear formatting"
        />
      </div>

      <EditorContent
        editor={editor}
        className="px-5 py-4 min-h-[250px] text-gray-800"
      />
    </div>
  );
}
