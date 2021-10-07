import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { ContentState, convertToRaw, Editor, EditorState } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import styled from 'styled-components';

type Props = {
  content?: string;
  onChange: (content: string) => void;
  readOnly?: boolean;
};

export const TextArea = forwardRef(
  ({ content, onChange, readOnly = false }: Props, ref) => {
    const [editorState, setEditorState] = useState(() => EditorState.createEmpty());
    const editorRef = useRef<any>(null);

    useEffect(() => {
      if (content && content.length > 0) {
        const blocksFromHtml = htmlToDraft(content);
        const { contentBlocks, entityMap } = blocksFromHtml;
        const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap);
        const editorState = EditorState.createWithContent(contentState);

        setEditorState(editorState);
      }
    }, [content]);

    useImperativeHandle(ref, () => ({
      clearEditor() {
        const newEditorState = EditorState.push(
          editorState,
          ContentState.createFromText(''),
          'remove-range'
        );

        setEditorState(newEditorState);
      },
    }));

    return (
      <StyledDraft>
        <div
          className="draft__wrapper"
          onClick={() => {
            setTimeout(() => {
              if (editorRef && editorRef.current) {
                editorRef.current.focus();
              }
            });
          }}
        >
          <Editor
            editorState={editorState}
            ref={editorRef}
            readOnly={readOnly}
            onChange={editorState => {
              onChange(
                editorState.getCurrentContent().hasText() ||
                  editorState.getCurrentContent().getPlainText().trim().length !== 0
                  ? draftToHtml(convertToRaw(editorState.getCurrentContent()))
                  : ''
              );

              setEditorState(editorState);
            }}
          />
        </div>
      </StyledDraft>
    );
  }
);

const StyledDraft = styled.div`
  .draft__wrapper {
    cursor: text;
  }

  .DraftEditor-root {
    min-height: 4rem;
    background: #fffff0;
    color: #212121;
    font-weight: 500;
    border-radius: 2px;
    font-size: 0.9rem;
    line-height: 1.5;
  }
`;
