import { FormEvent, SyntheticEvent, useEffect, useRef, useState } from 'react';
import { useQueryClient } from 'react-query';
import { BiTrash } from 'react-icons/bi';
import { GoPencil } from 'react-icons/go';
import { sanitize } from 'dompurify';
import styled from 'styled-components';

import { TextArea } from './TextArea';
import { deleteNote, generateId, saveNote } from '../helpers/notes';
import { useNotesQuery } from '../hooks/api/notes';
import { Modal } from './Modal';
import { EditableNote } from './EditableNote';
import { Note } from '../types';

type ModalStateProps = {
  state: boolean;
  content: Note | null;
};

export function Notes({ cityId }: { cityId: string }) {
  const textAreaRef = useRef();
  const formRef = useRef<HTMLFormElement>(null);

  const [modalOpen, setModalOpen] = useState<ModalStateProps>({
    state: false,
    content: null,
  });
  const [formState, toggleForm] = useState(false);
  const [note, setNote] = useState('');

  const queryClient = useQueryClient();
  const notes = useNotesQuery(cityId);

  useEffect(() => {
    if (formState && formRef?.current) {
      formRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
        inline: 'nearest',
      });
    }
  }, [formState]);

  const handleFormToggle = () => {
    toggleForm(!formState);
  };

  const deleteNoteHandler = async (e: SyntheticEvent, noteId: string) => {
    e.stopPropagation();

    await deleteNote(cityId, noteId);
    await queryClient.invalidateQueries(['notes', cityId]);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!note) {
      return;
    }

    const newNote = { id: generateId(), content: sanitize(note) };

    await saveNote(cityId, newNote);
    await queryClient.invalidateQueries(['notes', cityId]);

    if (textAreaRef && textAreaRef.current) {
      //@ts-expect-error
      textAreaRef.current.clearEditor();
    }
  };

  return (
    <StyledNotes>
      <Modal
        modalOpen={modalOpen.state}
        handleClose={() => setModalOpen({ state: false, content: null })}
        onClick={() => setModalOpen({ state: false, content: null })}
      >
        <div className="modal__content">
          <EditableNote cityId={cityId} note={modalOpen.content!} />
        </div>
      </Modal>

      <div className="notes__header">
        <h3>Notes</h3>
        <span onClick={handleFormToggle}>
          <GoPencil />
        </span>
      </div>

      {formState && (
        <form ref={formRef} className="notes__form" onSubmit={handleSubmit}>
          <div className="textarea">
            <TextArea onChange={val => setNote(val)} ref={textAreaRef} />
          </div>
          <button>save</button>
        </form>
      )}

      {notes.isLoading ? (
        <div>Loading...</div>
      ) : notes.isError ? (
        <div>Something went wrong</div>
      ) : (
        <div className="notes__list">
          {notes.data!.map((note, index) => (
            <div
              className="note"
              key={index}
              onClick={() => setModalOpen({ state: true, content: note })}
            >
              <div dangerouslySetInnerHTML={{ __html: sanitize(note.content) }} />
              <button className="trash__btn" onClick={e => deleteNoteHandler(e, note.id)}>
                <BiTrash />
              </button>
            </div>
          ))}
        </div>
      )}
    </StyledNotes>
  );
}

const StyledNotes = styled.section`
  margin-top: 3rem;

  .notes__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    max-width: 35rem;
    margin-left: auto;
    margin-right: auto;

    h3 {
      font-size: 1.5rem;
    }

    span {
      cursor: pointer;
      padding: 0.8rem 0;

      svg {
        font-size: 1.2rem;
      }
    }
  }

  .notes__form {
    max-width: 27rem;
    margin-left: auto;
    margin-right: auto;
    padding: 1rem;
    margin-bottom: 3rem;

    .textarea {
      padding: 1rem;
      background: #fffff0;
    }

    button {
      width: 100%;
      margin-top: 0.4rem;
      padding: 0.7rem 0.3rem;
      text-transform: uppercase;
      font-weight: 600;
      background: #9e579d;
      border: 1px solid #9e579d;
      color: #fff;
      border-radius: 1px;
      cursor: pointer;
    }
  }

  .notes__list {
    display: grid;
    gap: 2rem;
    grid-template-columns: repeat(auto-fit, minmax(min(13rem, 100%), 1fr));
    max-width: 40rem;
    margin-left: auto;
    margin-right: auto;
    padding-bottom: 5rem;

    .note {
      position: relative;
      border: 2px solid #69557d;
      padding: 0.5rem 1rem;
      border-radius: 8px;
      max-width: 20rem;
      cursor: pointer;

      p {
        margin-block: 0.5rem;
        font-weight: 500;
        font-size: 0.95rem;
      }

      &:hover {
        .trash__btn {
          display: inline-block;
        }
      }

      .trash__btn {
        display: none;
        position: absolute;
        background: inherit;
        border: none;
        top: 7%;
        right: 2%;
        cursor: pointer;
        z-index: 10;

        svg {
          font-size: 1.3rem;
          fill: #ffb17f;
        }
      }
    }
  }
`;
