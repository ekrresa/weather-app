import '@testing-library/react/dont-cleanup-after-each';
import { render, cleanup, screen } from '@testing-library/react';
import { Modal } from '../Modal';

describe('Header component', () => {
  afterEach(cleanup);

  test('should render children', () => {
    render(
      <Modal modalOpen={true} handleClose={() => {}} onClick={() => {}}>
        <h1>Don't look down</h1>
      </Modal>
    );

    const ModalContent = screen.getByText(/look/i);
    expect(ModalContent).toBeInTheDocument();
  });

  test('should not be visible', async () => {
    render(
      <Modal modalOpen={false} handleClose={() => {}} onClick={() => {}}>
        <h1>Don't look down</h1>
      </Modal>
    );

    const ModalContent = await screen.findByText(/look/i);
    expect(ModalContent).toBeFalsy();
  });
});
