import { SyntheticEvent, useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { IoPencil } from 'react-icons/io5';
import { sanitize } from 'dompurify';
import styled from 'styled-components';

import { TextArea } from './TextArea';
import { notesKeyFactory, useNotesQuery } from '../hooks/api/notes';
import { Note } from '../types';
import { editNotes } from '../helpers/notes';

type EditableNoteProps = {
  cityId: string;
  note: Note;
};

export function EditableNote({ cityId, note }: EditableNoteProps) {
  const [editMode, setEditMode] = useState(false);
  const [editedNote, setEditedNote] = useState('');

  const queryClient = useQueryClient();
  const notes = useNotesQuery(cityId);
  const notesRequest = useMutation((data: Note[]) => editNotes(cityId, data));

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    const newNotes = notes.data?.map(storedNote => {
      if (storedNote.id === note.id) {
        storedNote.content = sanitize(editedNote);
      }
      return storedNote;
    });

    notesRequest.mutate(newNotes!, {
      onError: err => {
        console.error(err);
      },
      onSuccess: async () => {
        await queryClient.invalidateQueries(notesKeyFactory.notesOfACity(cityId));
        setEditMode(false);
      },
    });
  };

  return (
    <StyledEditableNote>
      {!editMode && (
        <button className="edit__btn" onClick={() => setEditMode(true)}>
          <IoPencil />
        </button>
      )}

      <form onSubmit={handleSubmit}>
        <div>
          <TextArea
            content={note.content}
            onChange={val => setEditedNote(val)}
            readOnly={!editMode}
          />
        </div>

        <div className="form__footer">
          {editMode && (
            <button className="form__btn cancel__btn" onClick={() => setEditMode(false)}>
              cancel
            </button>
          )}
          {editMode && (
            <button className="form__btn" type="submit">
              save
            </button>
          )}
        </div>
      </form>
    </StyledEditableNote>
  );
}

const StyledEditableNote = styled.section`
  .edit__btn {
    border: 1px solid #fffff0;
    background: inherit;
    position: absolute;
    padding: 0.2rem;
    border-radius: 50%;
    cursor: pointer;
    top: 5%;
    right: 14%;

    svg {
      font-size: 1.1rem;
    }
  }

  .form__footer {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-top: 1.3rem;

    .form__btn {
      flex: 1;
      text-transform: uppercase;
      padding: 0.4rem;
      font-weight: 600;
      background: #9e579d;
      border: 1px solid #9e579d;
      color: #fff;
      border-radius: 5px;
      cursor: pointer;
    }

    .cancel__btn {
      background: #ff5959;
      border: 1px solid #ff5959;
    }
  }
`;
