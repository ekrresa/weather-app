import { FormEvent, useRef, useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { GoPencil } from 'react-icons/go';
import { sanitize } from 'dompurify';
import styled from 'styled-components';

import { TextArea } from './TextArea';
import { saveNotes } from '../helpers';
import { useNotesQuery } from '../hooks/api/notes';
import { Modal } from './Modal';

export function Notes({ cityId }: { cityId: string }) {
  const textAreaRef = useRef();
  const [modalOpen, setModalOpen] = useState({ state: false, content: '' });
  const [noteId, setNoteId] = useState('');
  const [formState, toggleForm] = useState(false);
  const [note, setNote] = useState('');

  const queryClient = useQueryClient();
  const notes = useNotesQuery(cityId);
  const notesRequest = useMutation((data: string) => saveNotes(cityId, data));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!note) {
      return;
    }

    notesRequest.mutate(sanitize(note), {
      onError: err => {
        console.log(err);
      },
      onSuccess: () => {
        queryClient.invalidateQueries(['note', cityId]);
        if (textAreaRef && textAreaRef.current) {
          //@ts-expect-error
          textAreaRef.current.clearEditor();
        }
      },
    });
  };

  return (
    <StyledNotes>
      <Modal
        modalOpen={modalOpen.state}
        handleClose={() => setModalOpen({ state: false, content: '' })}
        onClick={() => setModalOpen({ state: false, content: '' })}
      >
        <div
          className="modal__content"
          dangerouslySetInnerHTML={{ __html: sanitize(modalOpen.content) }}
        ></div>
      </Modal>

      <div className="notes__header">
        <h3>Notes</h3>
        <span onClick={() => toggleForm(!formState)}>
          <GoPencil />
        </span>
      </div>

      {formState && (
        <form className="notes__form" onSubmit={handleSubmit}>
          <TextArea onChange={val => setNote(val)} ref={textAreaRef} />
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
              dangerouslySetInnerHTML={{ __html: sanitize(note) }}
              onClick={() => setModalOpen({ state: true, content: note })}
            />
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
      border: 2px solid #69557d;
      padding: 0.5rem 1rem;
      border-radius: 8px;
      cursor: pointer;

      p {
        margin-block: 0.5rem;
        font-weight: 500;
        font-size: 0.95rem;
      }
    }
  }
`;
