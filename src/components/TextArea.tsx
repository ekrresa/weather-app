import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { ContentState, convertToRaw, Editor, EditorState } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import styled from 'styled-components';

type Props = {
  onChange: (content: string) => void;
};

export const TextArea = forwardRef(({ onChange }: Props, ref) => {
  const [editorState, setEditorState] = useState(() => EditorState.createEmpty());
  const editorRef = useRef<any>(null);

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
          onChange={editorState => {
            onChange(
              editorState.getCurrentContent().hasText() ||
                editorState.getCurrentContent().getPlainText().trim().length === 0
                ? draftToHtml(convertToRaw(editorState.getCurrentContent()))
                : ''
            );

            setEditorState(editorState);
          }}
        />
      </div>
    </StyledDraft>
  );
});

const StyledDraft = styled.div`
  .draft__wrapper {
  }

  .DraftEditor-root {
    min-height: 4rem;
    background: #fff;
    color: #212121;
    padding: 1rem;
    font-family: 'Roboto';
    border-radius: 2px;
    font-size: 0.9rem;
    line-height: 1.5;
  }
`;
